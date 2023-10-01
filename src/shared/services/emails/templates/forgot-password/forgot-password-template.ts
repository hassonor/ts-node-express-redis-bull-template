import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
    public passwordResetTemplate(username: string, resetLink: string): string {
        return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'), {
            username,
            resetLink,
            image_url: 'https://www.clipartmax.com/png/small/421-4210885_lock-svg-png-icon-free-download-free-lock-icon-png.png'
        });
    }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();