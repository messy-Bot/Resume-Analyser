package com.ai.Resume.analyser.mail;

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

    @Value("${mail.sender}")
    private String senderEmail;

    @Value("${mail.sender-name:Resume Analyser}")
    private String senderName;


    public void sentVerifyOtp(
            String username,
            String email,
            String otp) {

        String htmlContent =
                """
                <html>
                <body style="font-family: Arial, sans-serif;">

                    <h2>Resume Analyser</h2>

                    <p>Hello %s,</p>

                    <p>
                        Thank you for registering with Resume Analyser.
                    </p>

                    <p>
                        Your email verification OTP is:
                    </p>

                    <h1 style="letter-spacing: 6px;">
                        %s
                    </h1>

                    <p>
                        This OTP is valid for <b>10 minutes</b>.
                    </p>

                    <p>
                        If you did not request this OTP,
                        please ignore this email.
                    </p>

                    <br>

                    <p>
                        Regards,<br>
                        Resume Analyser Team
                    </p>

                </body>
                </html>
                """
                .formatted(username, otp);

        sendEmail(
                username,
                email,
                "Resume Analyser - Email Verification OTP",
                htmlContent
        );
    }


    public void sentResetOtp(
            String username,
            String email,
            String otp) {

        String htmlContent =
                """
                <html>
                <body style="font-family: Arial, sans-serif;">

                    <h2>Resume Analyser</h2>

                    <p>Hello %s,</p>

                    <p>
                        We received a request to reset your password.
                    </p>

                    <p>
                        Your password reset OTP is:
                    </p>

                    <h1 style="letter-spacing: 6px;">
                        %s
                    </h1>

                    <p>
                        This OTP is valid for <b>10 minutes</b>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>

                    <br>

                    <p>
                        Regards,<br>
                        Resume Analyser Team
                    </p>

                </body>
                </html>
                """
                .formatted(username, otp);

        sendEmail(
                username,
                email,
                "Resume Analyser - Password Reset OTP",
                htmlContent
        );
    }


    private void sendEmail(
            String username,
            String email,
            String subject,
            String htmlContent) {

        try {

            ApiClient apiClient =
                    Configuration.getDefaultApiClient();

            ApiKeyAuth apiKeyAuth =
                    (ApiKeyAuth) apiClient.getAuthentication(
                            "api-key"
                    );

            apiKeyAuth.setApiKey(apiKey);

            TransactionalEmailsApi emailApi =
                    new TransactionalEmailsApi(apiClient);


            SendSmtpEmailSender sender =
                    new SendSmtpEmailSender();

            sender.setEmail(senderEmail);
            sender.setName(senderName);


            SendSmtpEmailTo recipient =
                    new SendSmtpEmailTo();

            recipient.setEmail(email);
            recipient.setName(username);


            SendSmtpEmail mail =
                    new SendSmtpEmail();

            mail.setSender(sender);

            mail.setTo(
                    Collections.singletonList(recipient)
            );

            mail.setSubject(subject);

            mail.setHtmlContent(htmlContent);


            emailApi.sendTransacEmail(mail);

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to send email",
                    exception
            );
        }
    }
}
