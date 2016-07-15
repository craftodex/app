const inu = require('inu')
const { create, handleActions, handleEffects } = require('inux')
const defer = require('pull-defer')
const pull = inu.pull
const getFormData = require('get-form-data')

const { send } = require('app/send')

const GET = Symbol('get')
const SET = Symbol('set')

const LOGIN = Symbol('login')
const LOGOUT = Symbol('logout')
const SIGNUP = Symbol('signup')

const get = create(GET)
const set = create(SET)

const login = create(LOGIN)
const logout = create(LOGOUT)
const signup = create(SIGNUP)

module.exports = Account

function Account ({ api }) {
  return {
    init: () => ({
      model: null,
      effect: get()
    }),
    update: handleActions({
      [SET]: (model, user) => ({ model: user })
    }),
    views: {
      account: (model, dispatch) => {
        return inu.html`
          <div class='account'>
            <div>
              ${ model != null
                ? `hello ${model} !`
                : ''
              }
            </div>
            <button onclick=${handleLogout}>logout</button>
            <form onsubmit=${(ev) => ev.preventDefault()}>
              <fieldset>
                <label>email</label>
                <input name='email' type='email' autofocus />
              </fieldset>
              <fieldset>
                <label>password</label>
                <input name='password' type='password' />
              </fieldset>
              <input type='submit' onclick=${handleAuth(SIGNUP)} value='signup' />
              <input type='submit' onclick=${handleAuth(LOGIN)} value='login' />
            </form>
          </div>
        `

        function handleAuth (type) {
          return (ev) => {
            ev.preventDefault()
            const payload = getFormData(ev.target.parentElement)
            const effect = { type, payload }
            dispatch(send(effect))
          }
        }

        function handleLogout () {
          dispatch(send(logout()))
        }
      }
    },
    run: handleEffects({
      [GET]: () => {
        const user = JSON.parse(localStorage.getItem('holodex-user'))
        console.log('user', user)
        if (!user) return
        return pull.values([set(user)])
      },
      [SET]: (user) => {
        localStorage.setItem('holodex-user', JSON.stringify(user))
        return pull.values([set(user)])
      },
      [LOGOUT]: () => {
        return pull.values([send(set(null))])
      },
      [LOGIN]: (credentials) => {
        const deferred = defer.source()
        api.accounts.verify('basic', credentials, (err, account) => {
          if (err) return console.error(err)
          deferred.resolve(pull.values([send(set(account.key))]))
        })
      },
      [SIGNUP]: (credentials) => {
        const deferred = defer.source()
        api.accounts.create('basic', credentials, (err, account) => {
          if (err) return console.error(err)
          deferred.resolve(pull.values([send(set(account.key))]))
        })
      }
    })
  }
}