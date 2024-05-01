import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './style.css'; // Import the CSS file

const socket = io('http://localhost:3001'); // Update with your server URL

const Community = () => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('roomUsers', ({ users }) => {
            setUsers(users);
        });

        return () => {
            socket.off('message');
            socket.off('roomUsers');
        };
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (username.trim() !== '' && room.trim() !== '') {
            socket.emit('joinRoom', { username, room });
            setMessages([]); // Reset messages when joining a new room
            setShowForm(false);
        } else {
            alert('Please enter a username and select a room');
        }
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        const message = e.target.elements.msg.value;
        if (message.trim() !== '') {
            socket.emit('chatMessage', message);
            e.target.elements.msg.value = '';
        }
    };

    const handleLeaveRoom = () => {
        setShowForm(true);
        setUsers([]);
    };
    
    return (
        <div className="community-container">
            {showForm ? (
                <div className="join-container">
                    <header className="join-header">
                        <h1><i className="fas fa-smile"></i> ChatCord</h1>
                    </header>
                    <main className="join-main">
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-control">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Enter username..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="room">Room</label>
                                <select
                                    name="room"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    required
                                >
                                    <option value="">Select Room</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Python">Python</option>
                                    <option value="PHP">PHP</option>
                                    <option value="C#">C#</option>
                                    <option value="Ruby">Ruby</option>
                                    <option value="Java">Java</option>
                                </select>
                            </div>
                            <button type="submit" className="btn">Join Chat</button>
                        </form>
                    </main>
                </div>
            ) : (
                <div className="chat-container">
                    <header className="chat-header">
                        <h1><i className="fas fa-smile"></i> ChatCord</h1>
                        <button className="btn" onClick={handleLeaveRoom}>Leave Room</button>
                    </header>
                    <main className="chat-main">
                        <div className="chat-sidebar">
                            <h3><i className="fas fa-comments"></i> Room Name:</h3>
                            <h2 id="room-name">{room}</h2>
                            <h3><i className="fas fa-users"></i> Users</h3>
                            <ul id="users">
                                {users.map((user, index) => (
                                    <li key={index}>{user.username}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="chat-messages">
                            {messages.map((message, index) => (
                                <div className="message" key={index}>
                                    <p className="meta">{message.username} <span>{message.time}</span></p>
                                    <p className="text">{message.text}</p>
                                </div>
                            ))}
                        </div>
                    </main>
                    <div className="chat-form-container">
                        <form id="chat-form" onSubmit={handleMessageSubmit}>
                            <input
                                id="msg"
                                type="text"
                                placeholder="Enter Message"
                                required
                                autoComplete="off"
                                name="msg"
                            />
                            <button className="btn"><i className="fas fa-paper-plane"></i> Send</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
