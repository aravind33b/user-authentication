import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import Home from './components/Home';

function App() {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return <div className="container">{!session ? <Login /> : <Home session={session} />}</div>;
}

export default App;