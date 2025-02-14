import { useState } from "react";

const Login = () => {

    const [password, setPassword] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div className="form-log">
            <b>Connexion</b>
            <form action="">
                <label className="form-label" htmlFor="email">
                    Email
                    <input type="email" placeholder="exemple@exemple.com" required/>
                </label>
                <label className="form-label" htmlFor="password">
                    Mot de passe
                    <input type="password" value={password} onChange={handlePasswordChange} placeholder="Votre mot de passe" required />
                </label>
                <button disabled={password.length < 12} type="submit">Valider</button>
            </form>
        </div>
    )
}

export default Login;