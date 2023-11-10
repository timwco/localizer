import React, { Component } from 'react';
import { connect } from 'react-redux';
import copy from 'clipboard-copy';
import * as FireworksCanvas from 'fireworks-canvas';

import { validate } from '../lib/utils';
import { actions } from '../store';

class Finish extends Component {
  constructor() {
    super();
    this.state = {
      count: { total: 0, complete: 0 },
      dump: {},
      download: false,
    };
  }

  componentDidMount() {
    this.validate();
  }

  fireworks = () => {
    const container = document.querySelector('body');
    const options = {
      explosionMinHeight: 0.4,
      explosionMaxHeight: 0.9,
      maxRockets: 10,
    };
    const fireworks = new FireworksCanvas(container, options);
    fireworks.start();
  };

  validate() {
    const { store } = this.props;
    const { language, data } = store;
    const count = validate(data, language);
    this.setState({ count });
  }

  showData(e) {
    e.preventDefault();
    const { store } = this.props;
    this.setState({ dump: store.data, download: true });
    this.fireworks();
  }

  clipboard(e) {
    e.preventDefault();
    const { dump } = this.state;
    copy(JSON.stringify(dump, null, 2));
  }

  render() {
    const { count, download, dump } = this.state;
    return (
      <div className="finish columns">
        <div className="column is-two-thirds">
          {!download && (
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">All Done!</p>
              </header>
              <div className="card-content overflow">
                <div className="content">
                  <p>
                    A quick review shows you have completed{' '}
                    <strong>{count.complete}</strong> out of{' '}
                    <strong>{count.total}</strong> translation items.
                  </p>
                  <p>
                    If you are happy with this, you can now download the data
                    below.
                  </p>
                </div>
              </div>
              <footer className="card-footer">
                <a href="/localizer" className="card-footer-item">
                  Start Over
                </a>
                <a
                  href="/localizer"
                  onClick={e => this.showData(e)}
                  className="card-footer-item cfp"
                >
                  Download
                </a>
              </footer>
            </div>
          )}
          {download && (
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">Data</p>
                <a
                  href="/localizer"
                  onClick={e => this.clipboard(e)}
                  className="card-header-info"
                >
                  Copy
                </a>
              </header>
              <div className="card-content overflow">
                <div className="content">
                  <pre>{JSON.stringify(dump, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mstp = state => ({ store: state.store });

export default connect(
  mstp,
  { ...actions }
)(Finish);
