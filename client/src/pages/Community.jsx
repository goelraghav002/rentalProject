import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./style.css";
const Community = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        // Connect to Socket.IO server
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        // Cleanup function to disconnect socket when component unmounts
        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        // Listen for incoming messages
        if (socket) {
            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket && inputMessage.trim() !== '') {
            // Emit message to server
            socket.emit('chatMessage', inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1><i className="fas fa-smile"></i> ChatCord</h1>
                <button className="btn">Leave Room</button>
            </header>
            <main className="chat-main">
                <div className="chat-sidebar">
                    <h3><i className="fas fa-comments"></i> Room Name:</h3>
                    <h2 id="room-name">JavaScript</h2>
                    <h3><i className="fas fa-users"></i> Users</h3>
                    <ul id="users">
                        <li>Brad</li>
                        <li>John</li>
                        <li>Mary</li>
                        <li>Paul</li>
                        <li>Mike</li>
                    </ul>
                </div>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className="message">
                            <p className="meta">{message.username} <span>{message.time}</span></p>
                            <p className="text">{message.text}</p>
                        </div>
                    ))}
                </div>
            </main>
            <div className="chat-form-container">
                <form id="chat-form">
                    <input
                        id="msg"
                        type="text"
                        placeholder="Enter Message"
                        required
                        autoComplete="off"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button className="btn" onClick={sendMessage}><i className="fas fa-paper-plane"></i> Send</button>
                </form>
            </div>
        </div>
    );
};

export default Community;
