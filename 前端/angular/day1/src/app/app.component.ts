import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  disabled,
  email,
  form,
  FormField,
  hidden,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';

interface SignupFormModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  wantsNewsletter: boolean;
  newsletterEmail: string;
  hasReferral: boolean;
  referralCode: string;
}

@Component({
  selector: 'app-root',
  imports: [FormField, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly signupModel = signal<SignupFormModel>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    wantsNewsletter: false,
    newsletterEmail: '',
    hasReferral: false,
    referralCode: '',
  });

  readonly signupForm = form(this.signupModel, (path) => {
    required(path.name, { message: '请输入姓名' });

    required(path.email, { message: '请输入邮箱' });
    email(path.email, { message: '请输入正确的邮箱格式' });

    required(path.password, { message: '请输入密码' });
    minLength(path.password, 8, { message: '密码至少 8 位' });

    required(path.confirmPassword, { message: '请再次输入密码' });
    validate(path.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(path.password)) {
        return {
          kind: 'passwordMismatch',
          message: '两次输入的密码不一致',
        };
      }

      return null;
    });

    hidden(path.newsletterEmail, {
      when: ({ valueOf }) => !valueOf(path.wantsNewsletter),
    });
    required(path.newsletterEmail, {
      when: ({ valueOf }) => valueOf(path.wantsNewsletter),
      message: '订阅 newsletter 时需要填写接收邮箱',
    });
    email(path.newsletterEmail, {
      when: ({ valueOf }) => valueOf(path.wantsNewsletter),
      message: '请输入正确的 newsletter 邮箱',
    });

    disabled(path.referralCode, {
      when: ({ valueOf }) => (!valueOf(path.hasReferral) ? '没有邀请码时无需填写' : false),
    });
    required(path.referralCode, {
      when: ({ valueOf }) => valueOf(path.hasReferral),
      message: '勾选有邀请码后必须填写邀请码',
    });
  });

  readonly submitted = signal<SignupFormModel | null>(null);
  readonly formValueJson = computed(() => JSON.stringify(this.signupModel(), null, 2));

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.signupForm, {
      action: async () => {
        this.submitted.set(this.signupModel());
      },
    });
  }

  resetDemo() {
    this.signupModel.set({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      wantsNewsletter: false,
      newsletterEmail: '',
      hasReferral: false,
      referralCode: '',
    });
    this.submitted.set(null);
  }
}
