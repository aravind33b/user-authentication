import { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('saimon@devdactic.com');
	const [msg, setMsg] = useState('');

	const handleLogin = async (e: any) => {
		e.preventDefault();

		try {
			setLoading(true);
			const { error } = await supabase.auth.signInWithOtp({ email });

			if (error) {
				setMsg(error.message);
			} else {
				setMsg('Check your emails now!');
			}
		} catch (error: any) {
			setMsg(error.error_description || error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Supabase + React = 🚀</h1>
			<p className="description">Sign in via magic link with your email below</p>
			{loading ? (
				'Sending magic link...'
			) : (
				<form onSubmit={handleLogin}>
					<label htmlFor="email">Email:</label>
					<input
						id="email"
						className="input"
						type="email"
						placeholder="Your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button className="button">Get Magic Link</button>
				</form>
			)}
			<p className="message">{msg}</p>
		</div>
	);
}

export default Login;