import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../store';
import { uploadPlaceholder } from '../lib/messages';

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      code: '',
      error: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.checkForPrevious();
  }

  reload = e => {
    e.preventDefault();
    window.location.reload();
  };

  checkForPrevious() {
    const { next, setData } = this.props;
    const data = localStorage.getItem('lclData');
    if (data) {
      setData(JSON.parse(data));
      next(true);
    }
  }

  processCode(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const { code } = this.state;
    let localize = {};
    try {
      localize = JSON.parse(code);
    } catch (error) {
      localize = null;
    }
    this.validateCode(localize);
  }

  validateCode(localize) {
    const { next, setData } = this.props;
    if (localize) {
      localStorage.setItem('lclData', JSON.stringify(localize));
      setData(localize);
      setTimeout(() => {
        this.setState({ loading: false });
        next();
      }, 1500);
    } else {
      setTimeout(() => {
        this.setState({ error: true, loading: false });
      }, 1500);
    }
  }

  handleChange(e) {
    this.setState({ code: e.target.value });
  }

  render() {
    const { code, error, loading } = this.state;
    return (
      <div className="upload columns">
        <div className="field column is-two-thirds">
          <div className="control upload-container">
            {error && (
              <div className="error">
                <p>Something went wrong while processing your code.</p>
                <p>
                  Read the description, and try again. You can also check out{' '}
                  <a href="https://github.com/twhitacre/localizer">the docs</a>{' '}
                  if you need more help.
                </p>
                <p>
                  Otherwise...{' '}
                  <a href="/localizer/" onClick={e => this.reload(e)}>
                    Try Again
                  </a>
                </p>
              </div>
            )}
            {loading && (
              <div className="loading">
                <img src="assets/preloader.gif" alt="loading..." />
              </div>
            )}
            <textarea
              className="textarea is-primary"
              placeholder={uploadPlaceholder}
              rows="20"
              onChange={e => this.handleChange(e)}
              value={code}
            />
          </div>
        </div>
        <div className="field column is-one-third">
          <div className="control">
            <p>Welcome! This will help you localize your app.</p>
            <p>
              You can read more about it{' '}
              <a href="https://github.com/twhitacre/localizer">here</a>.
            </p>
            <br />
            <button
              type="button"
              onClick={e => this.processCode(e)}
              className="button is-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { ...actions }
)(Upload);
