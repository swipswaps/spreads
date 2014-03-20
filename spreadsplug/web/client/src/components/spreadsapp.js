/** @jsx React.DOM */
/* global require, module */
(function() {
  'use strict';

  var React = require('react/addons'),
      WorkflowForm = require('./workflowform'),
      CaptureInterface = require('./capture'),
      WorkflowDetails = require('./workflow'),
      WorkflowList = require('./workflowlist'),
      NavigationBar = require('./navbar'),
      LogDisplay = require('./logdisplay.js'),
      fnAlert = require('./foundation').alert;

  module.exports = React.createClass({
    componentDidMount: function() {
      this.props.messages.on('add change remove',
                             this.forceUpdate.bind(this, null));
    },
    getNavTitle: function(viewName) {
      var mappings = {
        create:       "spreads: new workflow",
        capture:      "spreads: capture",
        preferences:  "spreads: preferences",
        view:         "spreads: details"
      };
      if (mappings[viewName] !== undefined) {
        return mappings[viewName];
      } else {
        return "spreads";
      }
    },
    getViewComponent: function(viewName) {
      var workflows = this.props.workflows,
          workflowId = this.props.workflowId;
      switch (viewName) {
      case "create":
        var newWorkflow = new workflows.model(null, {collection: workflows});
        return <WorkflowForm workflow={newWorkflow}/>;
      case "capture":
        return <CaptureInterface workflow={workflows.get(workflowId)}/>;
      case "view":
        return <WorkflowDetails workflow={workflows.get(workflowId)}/>;
      case "log":
        return <LogDisplay />;
      default:
        return <WorkflowList workflows={workflows}/>;
      }
    },
    render: function() {
      var navTitle = this.getNavTitle(this.props.view),
          viewComponent = this.getViewComponent(this.props.view),
          getCloseCallback = function(message) {
            return function() {
              this.props.messages.remove([message]);
            }.bind(this);
          };
      return (<div>
                <NavigationBar title={navTitle} />
                {this.props.messages &&
                  this.props.messages.map(function(message) {
                    return (
                      <fnAlert level={message.get('level')}
                               message={message.get('message')}
                               closeCallback={getCloseCallback.bind(this)(message)}>
                        <a className="right" href='#/log'>(View detailed log)</a>
                      </fnAlert>);
                  }, this)}
                {viewComponent}
              </div>);
    }
  });
}());
