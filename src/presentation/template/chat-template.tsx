import { useState } from "react";
import { GptMessages, MyMessage, TypingLoader, TextMessageBox } from "../components";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text: text, isGpt: false }]);

    setIsLoading(false);

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessages text="Hola, puedes escribir tu texto en español, y te ayudo en las correcciones" />

          {
            messages.map( (message, index) => (
              message.isGpt
                ? (
                  <GptMessages key={ index } text="Esto es de OpenIA" />
                )
                : (
                  <MyMessage key={ index } text={message.text} />
                )
            ))
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }

        </div>
      </div>

      <TextMessageBox 
        onSendMessage={ handlePost }
        placeHolder="Escribe aquí lo que deseas"
        disableCorrections
      />

    </div>
  )
}
