import React, { Component } from 'react';
import { connect } from 'react-redux';
import ISO from '../lib/iso';
import { actions } from '../store';
import { validate } from '../lib/utils';

class Review extends Component {
  constructor() {
    super();
    this.state = { languages: [], addNew: false, local: false };
  }

  componentDidMount() {
    const { store, local } = this.props;
    if (local) {
      this.setState({ local: true });
    }
    const { data } = store;
    const languages = Object.keys(data[Object.keys(data)[0]]);
    this.setState({ languages });
  }

  reset = () => {
    localStorage.removeItem('lclData');
  };

  displayLanguages(languages) {
    const { store } = this.props;
    const { data } = store;
    return languages.map((lang, i) => {
      const count = validate(data, lang);
      const klass = count.percent === 100 ? 'success' : 'danger';
      return (
        <tr key={i}>
          <td>{ISO[lang].name}</td>
          <td>
            <span className={`tag is-${klass}`}>{`${count.percent}%`}</span>
          </td>
          <td>
            <a
              href="/localizer"
              onClick={e => this.loadLanguage(e, lang)}
              className="button is-text"
            >
              Edit All
            </a>
            {count.percent !== 100 && (
              <a
                href="/localizer"
                onClick={e => this.startReview(e, lang, count.incompleteData)}
                className="button is-text"
              >
                Finish Incomplete
              </a>
            )}
          </td>
        </tr>
      );
    });
  }

  displayOptions() {
    const keys = Object.keys(ISO);
    return keys.map((key, i) => (
      <li key={i}>
        <a href="/localizer" onClick={e => this.loadLanguage(e, key)}>
          {`[${key}] - ${ISO[key].name}`}
        </a>
      </li>
    ));
  }

  loadLanguage(e, lang) {
    const { next, setLanguage } = this.props;
    e.preventDefault();
    setLanguage(lang);
    next();
  }

  startReview(e, lang, incomplete) {
    const { next, setLanguage, setIncomplete } = this.props;
    e.preventDefault();
    setLanguage(lang);
    setIncomplete(incomplete);
    next();
  }

  render() {
    const { languages, addNew, local } = this.state;
    return (
      <div className="review columns">
        <div className="column is-two-thirds">
          {!addNew && (
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">Data Review</p>
              </header>
              <div className="card-content overflow">
                <div className="content">
                  {local && (
                    <p className="notice">
                      <strong>LOCAL STORAGE FOUND</strong> <br />
                      It looks like you might have been in the middle of a
                      translation before. <br />
                      Feel free to continue, or{' '}
                      <a href="/localizer" onClick={() => this.reset()}>
                        click here
                      </a>{' '}
                      to restart.
                    </p>
                  )}
                  <p>{`After parsing, we found ${
                    languages.length
                  } language(s) with translations.`}</p>
                  <table className="languages">
                    <thead>
                      <tr>
                        <th>Language</th>
                        <th>Complete</th>
                        <th>Options</th>
                      </tr>
                    </thead>
                    <tbody>{this.displayLanguages(languages)}</tbody>
                  </table>
                </div>
              </div>
              <footer className="card-footer">
                <button
                  type="button"
                  onClick={() => this.setState({ addNew: true })}
                  className="button is-primary is-fullwidth"
                >
                  Add Language
                </button>
              </footer>
            </div>
          )}
          {addNew && (
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">Select Language</p>
              </header>
              <div className="card-content overflow">
                <div className="content">
                  <ul className="menu-list languages">
                    {this.displayOptions()}
                  </ul>
                </div>
              </div>
            </div>
          )}
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
)(Review);
