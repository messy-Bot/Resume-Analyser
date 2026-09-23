package com.ai.Resume.analyser.service;

import com.brevo.ApiClient;
import com.brevo.Configuration;
import com.brevo.api.TransactionalEmailsApi;
import com.brevo.auth.ApiKeyAuth;
import com.brevo.model.SendSmtpEmail;
import com.brevo.model.SendSmtpEmailSender;
import com.brevo.model.SendSmtpEmailTo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class mailService {

    @Value("${apiKey}")
    private String apiKey;

    /*
     * IMPORTANT:
     * Replace this with the email address that you
     * verified as a sender in your Brevo account.
     */
    @Value("${mail.sender:your-verified-email@example.com}")
    private String senderEmail;

    @Value("${mail.sender-name:Resume Analyser}")
    private String senderName;

    public void sendMail(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent) {

        try {
            ApiClient defaultClient =
                    Configuration.getDefaultApiClient();

            ApiKeyAuth apiKeyAuth =
                    (ApiKeyAuth) defaultClient.getAuthentication(
                            "api-key"
                    );

            apiKeyAuth.setApiKey(apiKey);

            TransactionalEmailsApi api =
                    new TransactionalEmailsApi(defaultClient);

            SendSmtpEmailSender sender =
                    new SendSmtpEmailSender();

            sender.setEmail(senderEmail);
            sender.setName(senderName);

            SendSmtpEmailTo recipient =
                    new SendSmtpEmailTo();

            recipient.setEmail(recipientEmail);
            recipient.setName(
                    recipientName == null ||
                    recipientName.isBlank()
                            ? recipientEmail
                            : recipientName
            );

            SendSmtpEmail email =
                    new SendSmtpEmail();

            email.setSender(sender);
            email.setTo(
                    Collections.singletonList(recipient)
            );
            email.setSubject(subject);
            email.setHtmlContent(htmlContent);

            api.sendTransacEmail(email);

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send email",
                    exception
            );
        }
    }

    public void sendOtp(
            String email,
            String username,
            String otp) {

        String html =
                """
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Resume Analyser</h2>

                    <p>Hello %s,</p>

                    <p>
                        Your email verification OTP is:
                    </p>

                    <h1 style="letter-spacing: 6px;">
                        %s
                    </h1>

                    <p>
                        This OTP is valid for a limited time.
                    </p>

                    <p>
                        If you did not request this OTP,
                        please ignore this email.
                    </p>
                </body>
                </html>
                """.formatted(
                        username,
                        otp
                );

        sendMail(
                email,
                username,
                "Resume Analyser - Email Verification OTP",
                html
        );
    }

    public void sendResetOtp(
            String email,
            String otp) {

        String html =
                """
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Resume Analyser</h2>

                    <p>Hello,</p>

                    <p>
                        Your password reset OTP is:
                    </p>

                    <h1 style="letter-spacing: 6px;">
                        %s
                    </h1>

                    <p>
                        This OTP is valid for a limited time.
                    </p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>
                </body>
                </html>
                """.formatted(otp);

        sendMail(
                email,
                "",
                "Resume Analyser - Password Reset OTP",
                html
        );
    }
}
