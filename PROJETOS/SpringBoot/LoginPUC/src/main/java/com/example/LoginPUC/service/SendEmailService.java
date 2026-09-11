package com.example.LoginPUC.service;

import com.example.LoginPUC.exception.SendEmailException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SendEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("leonardofedericipettersen@gmail.com");

            mailSender.send(message);
        } catch (MailException e) {
            throw new SendEmailException("Falha ao enviar e-mail: " + e.getMessage());
        }
    }
}
