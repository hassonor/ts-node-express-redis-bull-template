import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
    public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
        const {username, email, ipaddress, date} = templateParams;
        return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
            username,
            email,
            ipaddress,
            date,
            image_url: 'https://www.clipartmax.com/png/small/421-4210885_lock-svg-png-icon-free-download-free-lock-icon-png.png'
        });
    }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();