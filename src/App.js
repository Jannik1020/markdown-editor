import React from 'react';
import * as ReactRedux  from 'react-redux';
import * as Redux from "redux";
import logo from './logo.svg';
import './App.css';
import marked from "marked";

//import scss
import "./presentational.scss";
import "./editorPreview.scss";

const initialText=`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

//marked
marked.setOptions({
  breaks: true,
});

// INSERTS target="_blank" INTO HREF TAGS (required for codepen links)
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + '</a>';
}


//redux
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
const UPDATE_PREVIEW = "UPDATE_PREVIEW";

const store = Redux.createStore(
  updatePreviewReducer
);

//actions
function updatePreviewAction(text){
  return {
    type: UPDATE_PREVIEW,
    text: text
  };
}

//reducers
function updatePreviewReducer(state = {text: initialText}, action){
  switch(action.type){
    case UPDATE_PREVIEW:
      return {
        text: action.text
      }
    default:
      return state;
  }
}

//prepare connect
function mapStateToProps(state){
  return {
    text: state.text
  };
}

function mapDispatchToProps(dispatch){
  return {
    updatePreview: function(text){
      dispatch(updatePreviewAction(text))
    }
  };
}


//components
class Presentational extends React.Component{

  render(){
    return (
      <div id="page-wrapper">
        <Editor text={this.props.text} updatePreview={this.props.updatePreview}/>
        <Preview text={this.props.text}/>
      </div>
    );
  }
}

class Editor extends React.Component{

  handleEditorChange(e){
    this.props.updatePreview(e.target.value);
  }

  render(){
    return (
      <div className="wrapper" id="editor-wrapper">
        <div className="header" id="editor-header">
          Editor
        </div>
        <textarea className="text-pane" id="editor" value={this.props.text} onChange={this.handleEditorChange.bind(this)}/>
      </div>
    )
  }
}

class Preview extends React.Component{

  render(){
    return (
      <div className="wrapper" id="preview-wrapper">
        <div className="header" id="preview-header">
          Preview
        </div>
        <div className="text-pane" id="preview" dangerouslySetInnerHTML={{__html: marked(this.props.text, {renderer: renderer})}}/>
    </div>
    )
  }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

function App() {
  return (
    <Provider store={store}> {/*TODO: create and provide store */}
      <Container/>
    </Provider>
  );
}



export default App;
