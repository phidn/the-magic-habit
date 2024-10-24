package infrastructure

import (
	"net/mail"

	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/pkg/mailer"
)

type Mailer struct {
	*mailer.SmtpClient
}

func NewMailer() *Mailer {

	mailer := &mailer.SmtpClient{
		Host:      config.Config.SmtpHost,
		Port:      config.Config.SmtpPort,
		Username:  config.Config.SmtpUsername,
		Password:  config.Config.SmtpPassword,
		Tls:       config.Config.SmtpTls,
		LocalName: config.Config.SmtpLocalName,
	}

	return &Mailer{mailer}
}

func (m *Mailer) SendMail(subject, html string, toMails ...string) error {
	toAddresses := make([]mail.Address, 0)
	for _, toMail := range toMails {
		toAddresses = append(toAddresses, mail.Address{Address: toMail})
	}

	message := &mailer.Message{
		From: mail.Address{
			Address: config.Config.SmtpSenderAddr,
			Name:    config.Config.SmtpSenderName,
		},
		To:      toAddresses,
		Subject: subject,
		HTML:    html,
	}
	return m.SmtpClient.Send(message)
}
