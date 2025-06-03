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

            // טעינת משתני סביבה (חיוני עבור Render)
            builder.Configuration.AddEnvironmentVariables();

            // PORT for Render
            var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
            builder.WebHost.UseUrls($"http://*:{port}");

            builder.Configuration.AddUserSecrets<Program>();
            builder.Configuration.AddJsonFile("Secret.json", optional: true, reloadOnChange: true);

            var jwtKey = builder.Configuration["JWT_KEY"];
            if (string.IsNullOrEmpty(jwtKey))
                throw new ArgumentNullException("Jwt:Key", "JWT Key must be provided in environment variables or configuration.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            builder.Services.AddHttpClient();

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true;
                });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", builder =>
                {
                    builder.WithOrigins(
                            "http://localhost:5173",
                            "https://my-react-project-6w5y.onrender.com",
                            "http://localhost:4200")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials(); // חשוב אם אתה שולח Cookies / JWT
                });
            });


            builder.Services.AddDbContext<DataContext>();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Magical Music API", Version = "v1" });
                options.SupportNonNullableReferenceTypes();

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            builder.Services.AddScoped<ISongService, SongService>();
            builder.Services.AddScoped<ISongRepository, SongRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ISingerRepository, SingerRepository>();
            builder.Services.AddScoped<ISingerService, SingerService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<AWSService>();
            builder.Services.AddScoped<ISongCuttingService, SongCuttingService>();
            builder.Services.AddScoped<ITranscriptionService, TranscriptionService>();
            builder.Services.AddAutoMapper(typeof(MappingProfile));

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

            builder.Services.AddDbContext<DataContext>(options =>
                options.UseMySql(
                    @"Server=btw6ujkgafer3ugtuqgm-mysql.services.clever-cloud.com;
                      Port=3306;
                      Database=btw6ujkgafer3ugtuqgm;
                      User=uvlvqnqycwjraz9t;
                      Password=qCV6Kk3IFLptHiJRXMV9",
                    new MySqlServerVersion(new Version(8, 0, 21))));

            var app = builder.Build();

            app.UseRouting();
            app.UseCors("AllowSpecificOrigin");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Magical Music API v1");
                c.RoutePrefix = "";
            });

            app.UseHttpsRedirection();

            app.MapGet("/", () => Results.Redirect("/swagger"));

            app.MapPost("/api/chat", async (IHttpClientFactory httpClientFactory, IConfiguration config, ChatRequest chatRequest) =>
            {
                var apiKey = config["OpenAI:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                    return Results.Problem("OpenAI API key is not configured.");

                if (chatRequest.Messages == null || chatRequest.Messages.Count == 0)
                    return Results.BadRequest("No messages provided.");

                var musicKeywords = new[] {
                    "מוזיקה", "שיר", "שירים", "מנגינה", "לחן", "קצב", "תווים", "אקורד", "הרמוניה", "זמר", "זמרת",
                    "beat", "melody", "music", "note", "song", "lyrics", "composer", "producer", "מיקס", "עיבוד"
                };

                bool isMusicRelated = chatRequest.Messages.Any(m =>
                    musicKeywords.Any(keyword =>
                        m.Content.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                    )
                );

                if (!isMusicRelated)
                {
                    return Results.BadRequest(new { content = "הצ'אט מיועד לשאלות הקשורות למוזיקה בלבד 🎵" });
                }

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

            app.MapControllers();

            app.Run();
        }
    }

    public record ChatRequest(List<Message> Messages);
    public record Message(string Role, string Content);
    public record OpenAIResponse(List<Choice> Choices);
    public record Choice(Message Message);
    public record TranscriptionRequest(IFormFile AudioFile);
}

