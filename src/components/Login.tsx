import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isIndividual, setIsIndividual] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signIn({ email, password })

    if (error) {
      alert(error.message)
    } else {
      // Redirect based on user type
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_individual')
        .eq('email', email)
        .single()

      if (userError) {
        alert(userError.message)
      } else {
        if (userData.is_individual) {
          window.location.href = '/individual-home'
        } else {
          window.location.href = '/company-home'
        }
      }
    }
    setLoading(false)
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    const { user, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else if (user) {
      // Insert into users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          user_id: user.id,
          email,
          username,
          is_individual: isIndividual,
        })
        .single()

      if (userError) {
        alert(userError.message)
      } else {
        // Insert into individuals or companies table
        if (isIndividual) {
          const { error: individualError } = await supabase
            .from('individuals')
            .insert({
              id: userData.id,
              first_name: firstName,
              last_name: lastName,
            })

          if (individualError) alert(individualError.message)
          else window.location.href = '/individual-home'
        } else {
          const { error: companyError } = await supabase
            .from('companies')
            .insert({
              id: userData.id,
              company_name: companyName,
            })

          if (companyError) alert(companyError.message)
          else window.location.href = '/company-home'
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isSignUp && (
            <>
              <div>
                <input
                  className="inputField"
                  type="text"
                  placeholder="Username"
                  value={username}
                  required={true}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    checked={isIndividual}
                    onChange={() => setIsIndividual(true)}
                  />
                  Individual
                </label>
                <label>
                  <input
                    type="radio"
                    checked={!isIndividual}
                    onChange={() => setIsIndividual(false)}
                  />
                  Company
                </label>
              </div>
              {isIndividual ? (
                <>
                  <div>
                    <input
                      className="inputField"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      required={true}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="inputField"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      required={true}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <input
                    className="inputField"
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    required={true}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              )}
            </>
          )}
          <div>
            <button className={'button block'} disabled={loading}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
        <div>
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}