# react-form

React Form

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import createFrom from '../src';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = e => {
    e.preventDefault();
    const res = this.props.form.validate();
    console.log(res);
  };

  render() {
    const { form } = this.props;
    const { getFieldProps } = form;

    return (
      <form onSubmit={this.onSubmit}>
        <p>simple input one</p>
        <input {...getFieldProps('normalOne', { initialValue: 'normal input one' })} />
        <input {...getFieldProps('normalTwo', { initialValue: 'normal input two' })} />
        <button>Submit</button>
      </form>
    );
  }
}

const Form = createFrom()(App);

ReactDOM.render(<Form />, document.getElementById('app'));
```

## Development

```js
yarn

yarn start
```

Open http://localhost:8080

## License

MIT ©️ Li Kexin
