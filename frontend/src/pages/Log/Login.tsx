import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <div className="form-log">
            <b>Connexion</b>
            <form action="">
                <label className="form-label" htmlFor="email">
                    Email
                    <input type="email" placeholder="exemple@exemple.com" onChange={handleEmailChange} required/>
                </label>
                <label className="form-label" htmlFor="password">
                    Mot de passe
                    <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={handlePasswordChange} 
                            placeholder="Votre mot de passe" 
                            required 
                        />
                    <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </label>
                <button disabled={password.length < 12 || email === ""} type="submit">Valider</button>
            </form>
        </div>
    )
}

export default Login;