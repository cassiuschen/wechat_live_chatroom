var socket = io.connect("http://localhost:8080");

$('a#submit').on('click', function() {
  socket.emit('message', $('#m').val());
  $('#m').val(' ');
  return false;
});

var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];


var MessageBox = React.createClass({
  loadMessagesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    socket.on('message', this.messageRecieve);
    return {data: []};
  },
  messageRecieve: function(msgInfo) {
    var messages = this.state.data;
    this.setState({data: messages.concat(msgInfo)});
  },
  componentDidMount: function() {
    this.loadMessagesFromServer();
    console.log(this);
    //this.updateDataFromSocket();
  },
  render: function() {
    return (
      <div className="messageBox">
        <h1>Messages</h1>
        <MessageList data={this.state.data} />
        <MessageForm onMessageSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function (message) {
      return (
        <Message author={message.author}>
          {message.text}
        </Message>
      );
    });
    return (
      <div className="messageList">
        {messageNodes}
      </div>
    );
  }
});

var MessageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onMessageSubmit({author: author, text: text});
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name"  ref="author"/>
        <input type="text" placeholder="Say something..." ref="text"/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <h2 className="messageAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

React.render(
  <MessageBox url="/messages.json" pollInterval={1000}/>,
  document.getElementById('content')
);
