import { LoginForm } from "../../components/AuthForms/loginForm";
import { SignUpForm } from "../../components/AuthForms/signupForm";

export default function LoginPage() {
    return (
        <div className="flex justify-around ">
            <div className="w-1/2">
                <LoginForm />
            </div>
            <div className="w-1/2">
                <SignUpForm />
            </div>
        </div>
    )
}