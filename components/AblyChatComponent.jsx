import React, { useEffect, useState } from 'react';
import { useChannel } from "./AblyReactEffect";
import styles from './AblyChatComponent.module.css';

const AblyChatComponent = () => {
    // accessando elementos HTML para criar variáveis para armazenar suas referências
    let inputBox = null;
    let messageEnd = null;

    //setando o estado inicial do componente 
    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0; //desabilita o botão de enviar qnd a area de texto está vazia

    const [channel, ably] = useChannel("chat-demo", (message) => {
        // Here we're computing the state that'll be drawn into the message history
        // We do that by slicing the last 199 messages from the receivedMessages buffer
    
        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);
    
        // Then finally, we take the message history, and combine it with the new message
        // This means we'll always have up to 199 message + 1 new message, stored using the
        // setMessages react useState hook
      });

      const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat-message", data: messageText });
        setMessageText("");
        inputBox.focus();
      }

      const handleFormSubmission = (e) => {
          e.preventDefault();
          // console.log(e);
          sendChatMessage(messageText);
        }

      // enviar mensagem ao precionar enter
      const handleKeyPress = (e) => {
        if (e.charCode !== 13 || messageTextIsEmpty) { // idéia original: usar e.charCode -> browser mostra erro, is not defined
          return;
        }
        e.preventDefault();
        sendChatMessage(messageText);
      }
       
      // -- Construindo a UI  -- verificando as mensagens já existentes
      const messages = receivedMessages.map((message, index) => {
        const author = message.connectionId === ably.connection.id ? "me" : "other";
        return <span key={index} className={styles.message} data-author={author}>{message.data}</span>;
      });

      useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" });
      });

      return (
        <div className={styles.chatHolder}>
          <div className={styles.chatText}>
            {messages}
            <div ref={(element) => { messageEnd = element; }}></div>  
            {/* empty element to control scroll to bottom */}
          </div>
          <form onSubmit={handleFormSubmission} className={styles.form}>
            <textarea
              ref={(element) => { inputBox = element; }}
              value={messageText}
              placeholder="Type a message..."
              onChange={e => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.textarea}
            ></textarea>
            <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>Send</button>
          </form>
        </div>
      )
    }
    
export default AblyChatComponent;