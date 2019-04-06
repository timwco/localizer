import React, { Component } from 'react';

// Process
import Upload from './Upload';
import Review from './Review';
import Translate from './Translate';
import Finish from './Finish';

class Process extends Component {

  constructor() {
    super();
    this.state = { step: 1 }
  }

  nextStep() {
    const { step } = this.state;
    this.setState({ step: step + 1 })
  }

  render() {
    const { step } = this.state;
    return (
      <div className="process">
        {step === 1 && <Upload next={this.nextStep.bind(this)} />}
        {step === 2 && <Review next={this.nextStep.bind(this)} />}
        {step === 3 && <Translate next={this.nextStep.bind(this)} />}
        {step === 4 && <Finish />}
      </div>
    );
  }
}

export default Process;
