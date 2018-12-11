import React from 'react';
import { argumentContainer, getValueFromEvent } from './utils';

function createForm() {
  function decorate(WrappedComponent) {
    class Form extends React.Component {
      constructor(props) {
        super(props);

        this.state = {};
        // 缓存的事件
        this.cacheAction = {};
        // 初始值
        this.initialValue = '';
      }

      onChange = (name, event) => {
        const value = getValueFromEvent(event);
        this.setField(name, { name, value });
      };

      bindTrigger = (name, action, fn) => {
        const cache = (this.cacheAction[name] = this.cacheAction[name] || {});
        if (!cache[action]) {
          cache[action] = fn.bind(this, name);
        }
        return cache[action];
      };

      getFieldProps = (name, options = {}) => {
        const { initialValue = '', trigger = 'onChange' } = options;
        const inputProps = { value: initialValue };
        this.initialValue = initialValue;
        inputProps[trigger] = this.bindTrigger(name, trigger, this.onChange);

        const field = this.getField(name);
        if (field && 'value' in field) {
          inputProps.value = field.value;
        }

        return inputProps;
      };

      validate = (name, cb) => {
        return this.getField(name, true);
      };

      getForm = () => {
        return {
          getFieldProps: this.getFieldProps,
          validate: this.validate,
        };
      };

      setField(name, field) {
        let stat = { [name]: field };
        if (typeof name === 'object') {
          stat = name;
        }
        this.setState(stat);
      }

      getField(name, copy) {
        const ret = this.state[name];
        if (copy) {
          // TODO: have some problem
          if (ret) {
            return { ...ret, name };
          }
          return { name, value: this.initialValue };
        }
        return ret;
      }

      render() {
        return <WrappedComponent form={this.getForm()} {...this.props} />;
      }
    }
    return argumentContainer(Form, WrappedComponent);
  }
  return decorate;
}

export default createForm;
