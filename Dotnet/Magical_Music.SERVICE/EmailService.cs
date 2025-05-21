using Magical_Music.CORE.Models;
using Magical_Music.CORE.Services;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(EmailRequest request)
        {
            // בדוק אם הכתובת לא ריקה
            if (string.IsNullOrWhiteSpace(request.To))
            {
                throw new ArgumentNullException(nameof(request.To), "Email address cannot be null or empty.");
            }

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Magical_Music🎶🌟🎵", _configuration["SMTP:GOOGLE_USER_EMAIL"]));
            emailMessage.To.Add(new MailboxAddress(request.To, request.To));
            emailMessage.Subject = request.Subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = request.Body;
            emailMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                try
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    await client.ConnectAsync(_configuration["SMTP:SMTP_SERVER"], int.Parse(_configuration["SMTP:PORT"]), SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_configuration["SMTP:GOOGLE_USER_EMAIL"], _configuration["SMTP:PASSWORD"]);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return false;
                }
            }
        }
    }
}
