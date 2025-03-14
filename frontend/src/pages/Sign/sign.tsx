import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Sign = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <div className="form-log">
            <b>Inscription</b>
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
                        {showPassword ? <EyeOff /> : <Eye stroke="#FF934F"/>}
                    </button>
                </label>
                <div className="links-supp">
                    <span>En appuyant sur "Valider", vous avez lu et vous acceptez les <Link to="/cgu">CGU</Link> et la <Link to="/privacy-policy">Politique de Confidentialité</Link>.  
                    </span>
                </div>
                <button className="btn" disabled={password.length < 12 || email === ""} type="submit">Valider</button>
            </form>
        </div>
    )
}

export default Sign;