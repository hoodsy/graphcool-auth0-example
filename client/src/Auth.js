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

  login = () => {

  }

  signup = async (e) => {
    e.preventDefault()
    const user = this.getFormData()
    console.log(user)
    try {
      const { data } = await this.props.signupMutation({
        variables: {
          input: user
        }
      })
      console.log(data)
      localStorage.setItem('token', data.signup.token)

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
  graphql(ME_QUERY, { name: 'meQuery' }),
)(Auth)
