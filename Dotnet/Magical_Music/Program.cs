using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using System.Text;
using Amazon.S3;
using Amazon;
using Microsoft.Extensions.DependencyInjection;
using Amazon.Runtime;
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using Magical_Music.DATA.Repositories;
using Magical_Music.DATA;
using Magical_Music.SERVICE;
using MagicalMusic.DATA.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Magical_Music
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // שליפת משתני הסביבה מ-User Secrets
            builder.Configuration.AddUserSecrets<Program>();

            // שליפת המפתח JWT_KEY
            var jwtKey = builder.Configuration["JWT_KEY"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new ArgumentNullException("Jwt:Key", "JWT Key must be provided in User Secrets");
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            // הוספת HttpClient לשימוש ב-OpenAI
            builder.Services.AddHttpClient();

            // הוספת שירותים
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true;
                });

            // הוספת מדיניות CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:5173")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Description = "Bearer Authentication with JWT Token",
                    Type = SecuritySchemeType.Http
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        },
                        new List<string>()
                    }
                });
            });

            // הזרקות שירותים קיימות שלך
            builder.Services.AddScoped<ISongService, SongService>();
            builder.Services.AddScoped<ISongRepository, SongRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ISingerRepository, SingerRepository>();
            builder.Services.AddScoped<ISingerService, SingerService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddScoped<AWSService>();
            builder.Services.AddAWSService<IAmazonS3>();
            builder.Services.AddScoped<ISongCuttingService, SongCuttingService>();

            // הוספת שירות תמלול
            builder.Services.AddScoped<ITranscriptionService, TranscriptionService>();
            builder.Services.AddHttpClient<ITranscriptionService, TranscriptionService>();

            // AWS configuration
            builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
            builder.Services.AddAWSService<IAmazonS3>();

            builder.Services.AddSingleton<IAmazonS3>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var credentials = new BasicAWSCredentials(
                    configuration["AWS:AccessKey"],
                    configuration["AWS:SecretKey"]
                );
                var clientConfig = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
                };
                return new AmazonS3Client(credentials, clientConfig);
            });

            // DbContext
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseMySql(
                    @"Server=btw6ujkgafer3ugtuqgm-mysql.services.clever-cloud.com;
                      Port=3306;
                      Database=btw6ujkgafer3ugtuqgm;
                      User=uvlvqnqycwjraz9t;
                      Password=qCV6Kk3IFLptHiJRXMV9",
                    new MySqlServerVersion(new Version(8, 0, 21))));

            // הוספת Anti-Forgery
            builder.Services.AddAntiforgery();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowSpecificOrigin");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseAntiforgery(); // הוספת middleware של Anti-Forgery

            // API Endpoint חדש ל-AI Chat
            app.MapPost("/api/chat", async (IHttpClientFactory httpClientFactory, IConfiguration config, ChatRequest chatRequest) =>
            {
                var apiKey = config["OpenAI:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                    return Results.Problem("OpenAI API key is not configured.");

                if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
                    return Results.BadRequest("No messages provided.");

                var httpClient = httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var requestBody = new
                {
                    model = "gpt-4o-mini",
                    messages = chatRequest.Messages,
                    max_tokens = 500
                };

                var response = await httpClient.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    return Results.Json(new { error = errorBody }, statusCode: (int)response.StatusCode);
                }

                var openAiResponse = await response.Content.ReadFromJsonAsync<OpenAIResponse>();
                var aiContent = openAiResponse?.Choices?[0]?.Message?.Content ?? "No response";

                return Results.Ok(new { content = aiContent });
            });

            // API Endpoint חדש לתמלול קובץ שמע
            app.MapPost("/api/transcribe", async (ITranscriptionService transcriptionService, [FromForm] TranscriptionRequest request) =>
            {
                if (request.AudioFile == null || request.AudioFile.Length == 0)
                    return Results.BadRequest("Audio file must be provided.");

                var audioFilePath = Path.Combine(Path.GetTempPath(), request.AudioFile.FileName);
                using (var stream = new FileStream(audioFilePath, FileMode.Create))
                {
                    await request.AudioFile.CopyToAsync(stream);
                }

                string result = await transcriptionService.TranscribeAudioAsync(audioFilePath);
                return Results.Ok(result);
            });

            app.MapControllers();
            app.Run();
        }
    }

    // DTOים ל-API
    public record ChatRequest(List<Message> Messages);
    public record Message(string Role, string Content);
    public record OpenAIResponse(List<Choice> Choices);
    public record Choice(Message Message);
    public record TranscriptionRequest(IFormFile AudioFile);
}
