import React from 'react'
import ReactDOM from 'react-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'


class Auth extends React.Component {
  getFormData = () => {
    return {
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.password).value,
      name: ReactDOM.findDOMNode(this.refs.name).value
    }
  }

  clearFormData = () => {
    const formElements = [
      ReactDOM.findDOMNode(this.refs.email),
      ReactDOM.findDOMNode(this.refs.password),
      ReactDOM.findDOMNode(this.refs.name)
    ].map(element => element.value = '')
  }

  login = async (e) => {
    e.preventDefault()
    const user = this.getFormData()
    try {
      console.log('LOGIN FIRED', this.props.loginMutation)
      const { data } = await this.props.loginMutation({
        variables: {
          input: user
        }
      })
      console.log(data)
      localStorage.setItem('token', data.login.token)
      this.clearFormData()
    } catch (e) {
      console.error(e)
    }
  }

  signup = async (e) => {
    e.preventDefault()
    const user = this.getFormData()
    try {
      const { data } = await this.props.signupMutation({
        variables: {
          input: user
        }
      })
      localStorage.setItem('token', data.signup.token)
      this.clearFormData()
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    console.log(this.props.meQuery)
    return (
      <div>
        <h1>Auth</h1>
        <form>
          <input
            type="text"
            ref="email"
            placeholder="rony@magicleap.com"
          />
          <input
            type="password"
            ref="password"
            placeholder="Anything at all"
          />
          <input
            type="text"
            ref="name"
            placeholder="Rony Abovitz"
          />
          <button onClick={this.signup}>
            Sign Up
          </button>
          <button onClick={this.login}>
            Login
          </button>
        </form>
      </div>
    )
  }
}

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      name
      email
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($input: AuthInput!) {
    login(input: $input) {
      token
      user {
        id
      }
    }
  }
`

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($input: AuthInput!) {
    signup(input: $input) {
      token
      user {
        id
      }
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
  graphql(ME_QUERY, { name: 'meQuery' }),
)(Auth)
