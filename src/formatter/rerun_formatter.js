import _ from 'lodash'
import Formatter from './'
import path from 'path'
import Status from '../status'


const RERUN_STATUSES = [
  Status.AMBIGUOUS,
  Status.FAILED,
  Status.PENDING,
  Status.UNDEFINED
]


export default class RerunFormatter extends Formatter {
  constructor(options) {
    super(options)
    this.scenarios = {}
  }

  handleFeaturesResult(featuresResult) {
    const mapping = {}
    featuresResult.scenarioResults.forEach((scenarioResult) => {
      if (_.includes(RERUN_STATUSES, scenarioResult.status)) {
        const scenario = scenarioResult.scenario
        const relativeUri = path.relative(this.cwd, scenario.uri)
        if (!mapping[relativeUri]) {
          mapping[relativeUri] = []
        }
        mapping[relativeUri].push(scenario.line)
      }
    })
    const text = _.map(mapping, (lines, relativeUri) => {
      return relativeUri + ':' + lines.join(':')
    }).join('\n')
    this.log(text)
  }
}
