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
  render: function() {
    return (
      <div className="messageBox">
        <h1>Messages</h1>
        <MessageList data={this.props.data} />
        <MessageForm />
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
  render: function() {
    return (
      <div className="messageForm">
        Hello, world! I am a MessageForm.
      </div>
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
  <MessageBox data={data} />,
  document.getElementById('content')
);
