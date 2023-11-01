import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import MessageModel from "../../../Models/MessageModel";
import socketService from "../../../Services/SocketService";
import "./Demo.css";
import avatar1 from "../../../images/man.png";
import avatar2 from "../../../images/women.png";
import logo from "../../../images/whatsapp.png"

function Demo(): JSX.Element {
  const { register, handleSubmit } = useForm<MessageModel>();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [nickname, setNickname] = useState("");
  const [color, setColor] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  const [messageText, setMessageText] = useState("");
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1"); // Default selection

  useEffect(() => {
    if (shouldFocusInput && messageInputRef.current) {
      messageInputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  useEffect(() => {
    if (messages.length > 0 && messagesSectionRef.current) {
      messagesSectionRef.current.scrollTop = messagesSectionRef.current.scrollHeight;
    }
  }, [messages]);

  const messagesSectionRef = useRef(null);

  function handleConnect() {
    if (nickname && color) {
      setIsConnected(true);
      const systemMessage = {
        nickname: "System",
        color: "gray",
        text: `${nickname} connected`,
        avatar: "systemAvatar", // Set a system avatar value
      };
      socketService.connect((message: MessageModel) => {
        setMessages((arr) => [...arr, message]);
      });
      socketService.send(systemMessage);
    } else {
      alert("Please choose nickname and color");
    }
  }

  function handleDisconnect() {
    if (nickname) {
      setIsConnected(false);
      const disconnectMessage = {
        nickname: "System",
        color: "gray",
        text: `${nickname} disconnected`,
        avatar: "systemAvatar", // Set a system avatar value
      };
      socketService.disconnect();
      socketService.send(disconnectMessage);
    } else {
      alert("Please choose a nickname first.");
    }
  }

  function sendMessage(message: MessageModel) {
    const messageWithAvatar = { ...message, avatar: selectedAvatar };
    socketService.send(messageWithAvatar);
    setMessageText("");
    setShouldFocusInput(true);
  }

  return (
    <div className="Demo">
      <h1><img className="logo" src={logo}/><br /> Whazzaaap</h1>
        
      <button onClick={handleConnect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={handleDisconnect} disabled={!isConnected}>
        Disconnect
      </button>
      <hr />

      <form onSubmit={handleSubmit(sendMessage)}>
        <section className="registerArea">
        <label>Nickname:</label>
        <input disabled={isConnected} type="text" {...register("nickname", { required: true })} value={nickname} onChange={(e) => setNickname(e.target.value)} />
    
        <label> Color: </label>
        <input disabled={isConnected} type="color" {...register("color", { required: true })} value={color} onChange={(e) => setColor(e.target.value)} />
        <br />

    <br/>
        <label>Choose Avatar:</label>
        <div className="avatar-options">
          <label>
            <input disabled={isConnected} type="radio" value="avatar1" checked={selectedAvatar === "avatar1"} onChange={() => setSelectedAvatar("avatar1")} />
            Avatar 1
            <img src={avatar1} alt="Avatar 1" className="avatar-icon" />

          </label>
          <label>
            <input disabled={isConnected} type="radio" value="avatar2" checked={selectedAvatar === "avatar2"} onChange={() => setSelectedAvatar("avatar2")} />
            Avatar 2
            <img src={avatar2} alt="Avatar 2" className="avatar-icon" />

          </label>
        </div>

        
        </section>

        <section ref={messagesSectionRef} className="messages-section">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.nickname === nickname ? "user-message" : ""}`}>
            <div className={`message-content ${m.nickname === nickname ? "user-message-content" : "server-message-content"}`}>
              <div className="avatar">
                <img src={m.avatar === "avatar1" ? avatar1 : avatar2} alt="Avatar" />
              </div>
              <div className="message-text">
                <span>{m.nickname}:</span>
                <span>{m.text}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

        <label>Message: </label>
        <input ref={messageInputRef} type="text" disabled={!isConnected} {...register("text", { required: true })} value={messageText} onChange={(e) => setMessageText(e.target.value)} autoFocus />
        <button disabled={!isConnected}>Send Message</button>
      </form>

      
    </div>
  );
}

export default Demo;
