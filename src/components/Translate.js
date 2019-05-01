import React, { Component } from 'react';
import { connect } from 'react-redux';
import ISO from '../lib/iso';
import { actions } from '../store';
import { filterObj } from '../lib/utils';

type Props = {
  store: Object,
  setData: Function,
  next: Function,
};

class Translate extends Component<Props> {
  constructor() {
    super();
    this.state = {
      language: {},
      working: {},
      key: 'en',
      length: 0,
      current: 0,
      val: '',
      complete: false,
      classes: 'tooltip is-tooltip-right is-tooltip-active',
    };
  }

  componentDidMount() {
    const { store } = this.props;
    const language = ISO[store.language];
    const { incomplete } = store;
    const { length } =
      incomplete.length > 0 ? incomplete : Object.keys(store.data);

    let working;
    if (incomplete.length > 0) {
      // working = filterObj(store.data, )
    } else {
      working = store.data;
    }

    const val = working[Object.keys(working)[0]][store.language];
    this.setState({ language, working, key: store.language, length, val });
  }

  field(current) {
    const { working } = this.state;
    return Object.keys(working)[current];
  }

  updateData(e) {
    e.preventDefault();
    const { key, working, current, val } = this.state;
    const { setData } = this.props;
    const field = this.field(current);
    working[field][key] = val;
    this.setState({ working }, () => {
      setData(working);
      localStorage.setItem('lclData', JSON.stringify(working));
      this.change(current);
    });
  }

  change(current, next = true) {
    const { working, key, length } = this.state;
    const num = next ? current + 1 : current - 1;
    if (num < 0) return;
    if (num > length - 1) {
      this.setState({ complete: true });
    } else {
      const field = this.field(num);
      const val = working[field][key] || '';
      this.setState({ current: num, val, classes: '' });
    }
  }

  prev(e, current) {
    e.preventDefault();
    this.change(current, false);
  }

  updateVal(e) {
    e.preventDefault();
    this.setState({ val: e.target.value });
  }

  complete(e) {
    e.preventDefault();
    const { next } = this.props;
    next();
  }

  render() {
    const {
      language,
      key,
      current,
      length,
      working,
      val,
      complete,
      classes,
    } = this.state;
    const field = this.field(current);
    return (
      <div className="translate columns">
        <div className="column is-two-thirds">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                <span className="tag is-primary">{`${
                  language.name
                } (${key})`}</span>
              </p>
              <p className="card-header-info">
                {`${current + 1} of ${length}`}
              </p>
            </header>
            <div className="card-content overflow">
              <div className="translator">
                <div className="field">
                  {field && (
                    <div className="control">
                      <p className="original">
                        <strong
                          className={classes}
                          data-tooltip="Original Translation"
                        >
                          {working[field].en}
                        </strong>
                      </p>
                      <form onSubmit={e => this.updateData(e)}>
                        <input
                          onChange={e => this.updateVal(e)}
                          className="input is-primary"
                          type="text"
                          placeholder="Translation..."
                          value={val}
                        />
                        <small>
                          Enter translation and press ENTER or click the button
                          to continue.
                        </small>
                        {complete && (
                          <a
                            onClick={e => this.complete(e)}
                            href="/localizer"
                            className="button is-primary next"
                          >
                            Finish
                          </a>
                        )}
                        {!complete && (
                          <button
                            type="submit"
                            className="button is-primary next"
                          >
                            Next
                          </button>
                        )}
                        <a
                          onClick={e => this.prev(e, current)}
                          href="/localizer"
                          className="button is-secondary prev"
                        >
                          Previous
                        </a>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <a onClick={e => this.complete(e)} href="/localizer" className="skip">
            Skip to Finish
          </a>
        </div>
      </div>
    );
  }
}

const mstp = state => ({
  store: state.store,
});

export default connect(
  mstp,
  { ...actions }
)(Translate);
