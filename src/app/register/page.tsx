'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../(auth)/LoginAsus.css'
import { authService } from '@/domains/auth/services/auth.service'

// Flecha arriba (azul)
const ArrowUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-label="arr_up" role="presentation" className="Select__arr__29dBP">
    <g data-name="icon_arr_up_16X16">
      <path data-name="路径 662" d="M14 11.2a.5.5 0 01-.152.36.5.5 0 01-.707-.012L8 6.22l-5.14 5.328a.5.5 0 01-.707.012.5.5 0 01-.012-.707l5.5-5.7A.5.5 0 018 5.001a.5.5 0 01.36.152l5.5 5.7a.5.5 0 01.14.347z" fill="#006ce1" />
    </g>
  </svg>
)

// Flecha abajo (gris)
const ArrowDown = ({ id }: { id: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-label="arr_down" role="presentation" className="Select__arr__29dBP">
    <defs><clipPath id={id}><path data-name="矩形 116" d="M0 0h16v16H0z" fill="#fff" /></clipPath></defs>
    <g data-name="icon_arr_down_16X16_2" clipPath={`url(#${id})`}>
      <path data-name="路径 662" d="M2 5.5a.5.5 0 01.859-.348L8 10.48l5.141-5.328a.5.5 0 11.719.695l-5.5 5.7a.5.5 0 01-.719 0l-5.5-5.7A.5.5 0 012 5.5z" fill="#666" />
    </g>
  </svg>
)

// SVG ojo cerrado
const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden={true} role="presentation" className="PasswordWithSMS__eye__28Jjr">
    <g data-name="组 991"><g data-name="组 990">
      <path data-name="联合 6" d="M5.708 19.413a.6.6 0 01-.065-.846l11.2-13.086a.6.6 0 01.846-.065.6.6 0 01.065.845l-11.2 13.086a.593.593 0 01-.456.21.6.6 0 01-.39-.144zm2.881-.908a.6.6 0 01-.345-.776.6.6 0 01.777-.344 8.7 8.7 0 005.057.457 9.67 9.67 0 003.809-1.841 14.321 14.321 0 003.047-3.27 16.027 16.027 0 00-4.3-3.8.6.6 0 01-.223-.819.6.6 0 01.819-.223 17.591 17.591 0 014.917 4.426l.254.321-.205.353a15.079 15.079 0 01-3.573 3.962 10.212 10.212 0 01-6.291 2.275 10.4 10.4 0 01-3.743-.721zm-2.586-1.291a23.105 23.105 0 01-4.663-3.989L1 12.856l.3-.4a18.5 18.5 0 013.687-3.473 14.108 14.108 0 014.079-2.061 10.028 10.028 0 015.142-.221.6.6 0 01.454.718.6.6 0 01-.718.454 8.817 8.817 0 00-4.531.2 12.917 12.917 0 00-3.729 1.888 18.181 18.181 0 00-3.107 2.834 21.27 21.27 0 004.06 3.4.6.6 0 01.19.827.6.6 0 01-.51.281.6.6 0 01-.317-.089zm4.388-.579a.6.6 0 01-.352-.773.6.6 0 01.773-.352 3.129 3.129 0 001.11.2 3.08 3.08 0 003.115-3.035 2.983 2.983 0 00-.412-1.51.6.6 0 01.211-.822.6.6 0 01.822.212 4.182 4.182 0 01.578 2.121 4.28 4.28 0 01-4.315 4.235 4.371 4.371 0 01-1.53-.276zm-2.544-2.57a4.17 4.17 0 01-.238-1.39 4.28 4.28 0 014.315-4.235 4.387 4.387 0 01.868.086.6.6 0 01.469.706.6.6 0 01-.708.469 3.212 3.212 0 00-.628-.062 3.081 3.081 0 00-3.115 3.036 2.97 2.97 0 00.169.99.6.6 0 01-.365.765.576.576 0 01-.2.036.6.6 0 01-.567-.402z" fill="#4d4d4d" />
    </g></g>
  </svg>
)

// SVG ícono capslock
const CapsLockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-label="icon_notice_16X16_02" role="presentation" className="PasswordWithSMS__capslock__89_hD">
    <g data-name="icon_notice_16X16_02"><g data-name="组 1622">
      <path data-name="路径 1684" d="M8 .5A7.5 7.5 0 11.5 8 7.508 7.508 0 018 .5zm0 14A6.5 6.5 0 101.5 8 6.508 6.508 0 008 14.5z" className="cls-3" />
      <path data-name="矩形 831" d="M7.65 7.65h.7v3.5h-.7z" className="cls-3" />
      <path data-name="矩形 832" d="M7.65 7.65h.7v3.5h-.7z" className="cls-4" />
      <path data-name="矩形 833" d="M7.65 4.85h.7v.7h-.7z" className="cls-3" />
      <path data-name="矩形 834" d="M7.65 4.85h.7v.7h-.7z" className="cls-4" />
    </g></g>
  </svg>
)

type OpenDropdown = 'year' | 'month' | 'day' | null

export default function RegisterPage() {
  // ── Estado checkboxes ──────────────────────────────────────────
  const [selectAll, setSelectAll] = useState(false)
  const [opt1, setOpt1] = useState(false)
  const [opt2, setOpt2] = useState(false)
  const [opt3, setOpt3] = useState(false)
  const [opt4, setOpt4] = useState(false)

  // Cuando cambia el maestro: marca / desmarca todos
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setOpt1(checked)
    setOpt2(checked)
    setOpt3(checked)
    setOpt4(checked)
  }

  // Cuando cambia un hijo: recalcula si todos están marcados
  const handleChild = (setter: (v: boolean) => void, checked: boolean) => {
    setter(checked)
  }

  // Sincronizar el maestro cuando los hijos cambian
  useEffect(() => {
    setSelectAll(opt1 && opt2 && opt3 && opt4)
  }, [opt1, opt2, opt3, opt4])

  // ── Estado dropdowns de fecha ──────────────────────────────────
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const bdRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bdRef.current && !bdRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (name: OpenDropdown) =>
    setOpenDropdown(prev => (prev === name ? null : name))

  // ── Conexión Supabase ──────────────────────────────────────────────────
  const router = useRouter()
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formConfirm, setFormConfirm] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    if (!formEmail) { setServerError('El correo electrónico es requerido.'); return }
    if (!formPassword) { setServerError('La contraseña es requerida.'); return }
    if (formPassword.length < 6) { setServerError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (formPassword !== formConfirm) { setServerError('Las contraseñas no coinciden.'); return }

    setIsSubmitting(true)
    try {
      const nombre = formEmail.split('@')[0]
      await authService.register({ nombre, email: formEmail, password: formPassword, confirmPassword: formConfirm })
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse'
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setServerError('Este correo ya está registrado. Intenta iniciar sesión.')
      } else if (msg.includes('Password should be')) {
        setServerError('La contraseña debe tener al menos 6 caracteres.')
      } else {
        setServerError(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Script Project-SGC ────────────────────────────────────────────────
  useEffect(() => {
    // AsusAPIConfig ya está definido en el layout via <script> inline síncrono,
    // por lo que getCountryByIp lo encuentra disponible desde el primer momento.

    // Guardia contra la carga múltiple del script para evitar el error
    // "only one instance of babel-polyfill is allowed"
    if (!(window as any).__memberEntryPageLoaded) {
      ; (window as any).__memberEntryPageLoaded = true
      const script = document.createElement('script')
      script.src = '/Entry_Page/public/js/memberEntryPage.js?t=27'
      script.type = 'text/javascript'
      document.body.appendChild(script)
    }

    const loginLink = document.getElementById('LogInLink')
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault()
        window.location.href = '/login'
      })
    }

    // Nota: no eliminamos el script al desmontar para no disparar una recarga
    // que volvería a instanciar babel-polyfill
  }, [])

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="asus-login-page">
      {/* Elemento requerido por memberEntryPage.js: llama a document.getElementById("loading").style.display="none"
          al completar getCountryByIp. Sin este div se produce TypeError: Cannot set properties of null */}
      <div id="loading" style={{ display: 'none' }} aria-hidden={true} />
      <link href="/Entry_Page/public/css/memberEntryPage.css?t=27" rel="stylesheet" />

      {/* HEADER */}
      <header className="asus-header">
        <div className="asus-logo">
          <Link href="/login"></Link>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="asus-wrapper" style={{ alignItems: 'flex-start', paddingTop: '24px', paddingBottom: '24px' }}>
        <div>
          <div className="SignUp__wrapper__1USAO">
            <div className="SignUp__main__3aV_7">
              <h1 className="SignUp__title__1ri_9">Únase</h1>
              <div className="SignUp__subtitle__2lS-H">
                Por favor, tenga en cuenta que la cuenta de Project-SGC es la misma que la cuenta ROG. Si tiene una de las dos
                cuentas, podrá <u id="LogInLink">iniciar sesión</u> directamente sin registrar una nueva.
              </div>
              <div className="SignUp__reminder__Ro2j5">
                {' '}Recordatorio: Elegir la opcion &apos;Ocultar mi correo electronico&apos; al usar una ID de Apple o
                una cuenta de Facebook puede resultar en la perdida de notificaciones de ofertas exclusivas y
                actualizaciones criticas.
              </div>

              {/* Botones sociales */}
              <div role="list" className="SignUp__thirdPartyIcon__J1lVC">
                <a href="oauth/apple/?op=login" role="listitem">
                  <span>Sign up with</span> <img src="/img/openid/icon_apple.svg" alt="Apple" />
                  <span className="SignUp__tooltiptext__nAVJl">Sign up with Apple</span>
                </a>
                <a href="oauth/facebook/?op=login" role="listitem">
                  <span>Sign up with</span> <img src="/img/openid/icon_fb.svg" alt="Facebook" />
                  <span className="SignUp__tooltiptext__nAVJl">Sign up with Facebook</span>
                </a>
                <a href="oauth/google/?op=login" role="listitem">
                  <span>Sign up with</span> <img src="/img/openid/icon_google.svg" alt="Google" />
                  <span className="SignUp__tooltiptext__nAVJl">Sign up with Google</span>
                </a>
                <a href="oauth/microsoft/?op=login" role="listitem">
                  <span>Sign up with</span> <img src="/img/openid/icon_microsoft.svg" alt="Microsoft" />
                  <span className="SignUp__tooltiptext__nAVJl">Sign up with Microsoft</span>
                </a>
              </div>

              <form onSubmit={handleRegister}>
                {/* Separador */}
                <div className="SignUp__socialAccountLoginDesc__YICqp">
                  <span>O inicia sesión con</span>
                </div>

                {/* Email */}
                <div className="controlGroup Account2__controlGroup__hdLXd">
                  <label htmlFor="txtMail" id="loginAccountLabel" className="Account2__isNewSignupTitle__1OrNo">Cuenta</label>
                  <div className="Account2__Phone__1gUO4">
                    <div className="">
                      <div className="Account2__countryPhoneCode__2P2Ki" style={{ display: 'none' }}>tw(+886)</div>
                      <input type="text" id="txtMail" autoComplete="username" required aria-labelledby="loginAccountLabel" className="" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                    </div>
                    <div className="Account2__format__1Ceq6">Su correo electrónico</div>
                  </div>
                </div>

                {/* Contraseña */}
                <div className="controlGroup PasswordWithSMS__controlGroup__2bAw5 PasswordWithSMS__pwd__31g_K">
                  <div className="PasswordWithSMS__rwdStyleForTwoChildrenTooMuchWords__11jTF">
                    <label htmlFor="txtPassword1" className="PasswordWithSMS__isNewSignupTitle__YnqX4">Contraseña</label>
                  </div>
                  <div className="PasswordWithSMS__input__eAybB">
                    <input id="txtPassword1" autoComplete="new-password" required type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />
                    <div className="message PasswordWithSMS__messageCapslock__h8KCA"></div>
                    <CapsLockIcon />
                    <div tabIndex={0} role="button" aria-label="&nbsp;Ocultar contraseña" className="PasswordWithSMS__eyeWrap__1X218">
                      <EyeClosed />
                    </div>
                  </div>
                  <div className="PasswordWithSMS__format__35Tdm">
                    Combinación de 8 a 25 letras (mayúsculas/minúsculas), números y símbolos sin espacios.
                    <button type="button">Guía de Contraseña.</button>
                  </div>
                </div>

                {/* Repetir contraseña */}
                <div className="controlGroup PasswordWithSMS__controlGroup__2bAw5 PasswordWithSMS__pwd__31g_K">
                  <div className="PasswordWithSMS__rwdStyleForTwoChildrenTooMuchWords__11jTF">
                    <label htmlFor="txtPassword2" className="PasswordWithSMS__isNewSignupTitle__YnqX4">
                      <span style={{ color: 'red', fontSize: '18px' }}><b>*</b></span>{' '}
                      Volver a introducir la contraseña:
                    </label>
                  </div>
                  <div className="PasswordWithSMS__input__eAybB">
                    <input id="txtPassword2" autoComplete="new-password" required type="password" value={formConfirm} onChange={(e) => setFormConfirm(e.target.value)} />
                    <div className="message PasswordWithSMS__messageCapslock__h8KCA"></div>
                    <CapsLockIcon />
                    <div tabIndex={0} role="button" className="PasswordWithSMS__eyeWrap__1X218">
                      <EyeClosed />
                    </div>
                  </div>
                  <div className="PasswordWithSMS__format__35Tdm">Vuelve a introducir tu contraseña.</div>
                </div>

                {/* ── FECHA DE NACIMIENTO ── */}
                <div className="BirthDay2__birthDaySelector__1Gl6P BirthDay2__borderVer__24UZq" ref={bdRef}>
                  <fieldset>
                    <legend className="BirthDay2__birthDayTitle__zQQD_"> Fecha de nacimiento: </legend>
                    <div className="BirthDay2__birthDaySelectGroup__2KsNk">

                      {/* Año */}
                      <div className="Select__select__3l_Si Select__birthdayY__1s52l">
                        <div
                          className="Select__input__3r4iT"
                          onClick={() => toggleDropdown('year')}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          {selectedYear ?? 'Año'}
                          {openDropdown === 'year' ? <ArrowUp /> : <ArrowDown id="clipYear" />}
                        </div>
                        <div className="Select__dropdownOutter__3wKHO" style={{ display: openDropdown === 'year' ? 'block' : 'none' }}>
                          <ul className="Select__selectDropdown__sEMI7">
                            {Array.from({ length: 100 }, (_, i) => 2026 - i).map((year) => (
                              <li
                                key={year}
                                className={selectedYear === year ? 'Select__selected__' : ''}
                                onClick={() => { setSelectedYear(year); setOpenDropdown(null) }}
                                style={{ cursor: 'pointer' }}
                              >
                                {year}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Mes */}
                      <div className="Select__select__3l_Si">
                        <div
                          className="Select__input__3r4iT"
                          onClick={() => toggleDropdown('month')}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          {selectedMonth ?? 'Mes'}
                          {openDropdown === 'month' ? <ArrowUp /> : <ArrowDown id="clipMonth" />}
                        </div>
                        <div className="Select__dropdownOutter__3wKHO" style={{ display: openDropdown === 'month' ? 'block' : 'none' }}>
                          <ul className="Select__selectDropdown__sEMI7">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                              <li
                                key={m}
                                className={selectedMonth === m ? 'Select__selected__' : ''}
                                onClick={() => { setSelectedMonth(m); setOpenDropdown(null) }}
                                style={{ cursor: 'pointer' }}
                              >
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Día */}
                      <div className="Select__select__3l_Si">
                        <div
                          className="Select__input__3r4iT"
                          onClick={() => toggleDropdown('day')}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          {selectedDay ?? 'Día'}
                          {openDropdown === 'day' ? <ArrowUp /> : <ArrowDown id="clipDay" />}
                        </div>
                        <div className="Select__dropdownOutter__3wKHO" style={{ display: openDropdown === 'day' ? 'block' : 'none' }}>
                          <ul className="Select__selectDropdown__sEMI7">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <li
                                key={d}
                                className={selectedDay === d ? 'Select__selected__' : ''}
                                onClick={() => { setSelectedDay(d); setOpenDropdown(null) }}
                                style={{ cursor: 'pointer' }}
                              >
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  </fieldset>
                </div>

                {/* ── CHECKBOXES DE ACUERDO ── */}
                <div className="Agreement2__agreement__2vJLE Agreement2__rememberMe__3-iyt Agreement2__signupPage__35Zvi">
                  {/* Maestro: selecciona/deselecciona todos */}
                  <label htmlFor="option">
                    <input
                      type="checkbox"
                      id="option"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />{' '}
                    <span className="Agreement2__checkmark__26hzW"></span>
                    Acepto todos los puntos siguientes y la Política de Privacidad.
                  </label>

                  <ul>
                    <li>
                      <label htmlFor="option1">
                        <input
                          type="checkbox"
                          id="option1"
                          value="Agreement_Asus"
                          checked={opt1}
                          onChange={(e) => handleChild(setOpt1, e.target.checked)}
                        />
                        <span className="Agreement2__checkmark__26hzW Agreement2__error__3yDRG"></span>
                        <span className="Agreement2__redStar__3irFt">*</span>{' '}
                        <span>
                          <span style={{ color: 'red', fontSize: '18px' }}><b>*</b></span>
                          Estoy de acuerdo y acepto la de <span className="underline">Project-SGC</span>
                          <a href="http://www.asus.com/es/Terms_of_Use_Notice_Privacy_Policy/Privacy_Policy/" target="_blank" rel="noreferrer">
                            &quot;Política de Privacidad&quot;
                          </a>
                        </span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="option2">
                        <input
                          type="checkbox"
                          id="option2"
                          value="Agreement_AsusCloud"
                          checked={opt2}
                          onChange={(e) => handleChild(setOpt2, e.target.checked)}
                        />{' '}
                        <span className="Agreement2__checkmark__26hzW Agreement2__error__3yDRG"></span>{' '}
                        <span className="Agreement2__redStar__3irFt">*</span>{' '}
                        <span>
                          <span style={{ color: 'red', fontSize: '18px' }}><b>*</b></span>
                          Estoy de acuerdo y acepto la de <span className="underline">Project-SGC Cloud</span>
                          <a href="https://service.asuswebstorage.com/privacy/" target="_blank" rel="noreferrer">
                            &quot;Política de Privacidad&quot;
                          </a>
                        </span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="option3">
                        <input
                          type="checkbox"
                          id="option3"
                          value="SubscribeEdm_Asus"
                          checked={opt3}
                          onChange={(e) => handleChild(setOpt3, e.target.checked)}
                        />
                        <span className="Agreement2__checkmark__26hzW"></span>{' '}
                        <span>
                          Mantenerme al día mediante eDM y avisos con noticias de Project-SGC, los últimos productos e
                          información de servicio.
                        </span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="option4">
                        <input
                          type="checkbox"
                          id="option4"
                          value="SubscribeEdm_AsusCloud"
                          checked={opt4}
                          onChange={(e) => handleChild(setOpt4, e.target.checked)}
                        />{' '}
                        <span className="Agreement2__checkmark__26hzW"></span>{' '}
                        <span>
                          Mantenerme al día mediante eDM y avisos con noticias de Project-SGC Cloud, los últimos productos e
                          información de servicio.
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>

                {/* Nota legal */}
                <div className="SignUp__buttonWord__3HX1r">
                  *{' '}
                  <span>
                    Por favor, tenga la confianza de que la información recopilada solamente se utilizará con el
                    propósito de registrar y gestionar sus cuentas.<br />
                    Cuando se haya registrado con éxito su miembro, también le ayudaremos a registrarse como Miembro
                    de la nube de Project-SGC propiedad de Project-SGC Cloud Corporation con la misma cuenta y contraseña.
                  </span>
                </div>

                {/* Error de registro */}
                {serverError && (
                  <div style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '12px', padding: '8px 12px', background: '#fdecea', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
                    {serverError}
                  </div>
                )}

                {/* Botón */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn ButtonBlue__btnBlue__3wsfN ButtonBlue__onlyMobileFullWidth__26mIX ButtonBlue__isMaxWidth184__33oDz"
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    <div className="ButtonBlue__inner__Lz-1I">
                      <span>{isSubmitting ? 'Registrando...' : 'Registrarme'}</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <input name="Source" type="hidden" id="Source" value="0000000000" />
      </div>

      {/* FOOTER */}
      <footer className="asus-footer">
        <div className="asus-footer-content">
          <div className="asus-footer-copy">
            © ASUSTeK Computer Inc. Todos los derechos reservados. / Project SGC
          </div>
          <div className="asus-footer-links">
            <a href="https://www.asus.com/es/terms_of_use_notice_privacy_policy/official-site/" target="_blank" rel="noreferrer">
              Términos de aceptación
            </a>
            <a href="https://www.asus.com/es/terms_of_use_notice_privacy_policy/privacy_policy/" target="_blank" rel="noreferrer">
              Política de privacidad
            </a>
            <button
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4d4d4d', fontSize: '0.75rem', fontFamily: 'inherit' }}
              onClick={() => (window as any).triggerCookieBanner?.()}
            >
              Configuración de cookies
            </button>
          </div>
          <div className="asus-footer-locale">
            <span>Spain / Español</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
