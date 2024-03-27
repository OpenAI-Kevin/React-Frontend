import { useState } from "react";
import { GptMessages, MyMessage, TypingLoader, TextMessageBox, GptMessageImage, GptMessageSelectableImage } from "../../components";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: 'Image base',
      info: {
        alt: 'Image base',
        imageUrl: 'http://localhost:3000/gpt/image-generation/1711574098912.png'
      }
    }
  ]);
  
  const [originalImageMask, setOriginalImageMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async() => {
    setIsLoading(true);
    const resp = await imageVariationUseCase( originalImageMask.original! );
    setIsLoading(false)

    if ( !resp ) return;

    setMessages( (prev) => [
      ...prev,
      {
        text: 'Variación',
        isGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt
        }
      }
    ] )
  }

  const handlePost = async (text: string) => {

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { original, mask } = originalImageMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);

    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [...prev, { text: 'No se pudo generar la imagen', isGpt: true }]);
    }

    setMessages((prev) => [...prev, {
      text: text,
      isGpt: true,
      info: {
        imageUrl: imageInfo.url,
        alt: imageInfo.alt
      }
    }])

  }

  return (
    <>
      {
        originalImageMask.original && (
          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
            <span>Editando</span>
            <img
            className="border rounded-xl w-36 h-36 object-contain"
              src={ originalImageMask.mask ?? originalImageMask.original }
              alt="Imagen original"
            />
            <button onClick={ handleVariation } className="btn-primary mt-2" >Generar variación</button>
          </div>
        )
      }

      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">

            {/* Bienvenida */}
            <GptMessages text="¿Qué imagen quieres generar hoy?" />

            {
              messages.map((message, index) => 
                message.isGpt
                  ? (
                    // <GptMessageImage
                    <GptMessageSelectableImage
                      key={index}
                      text={message.text}
                      imageUrl={message.info?.imageUrl!}
                      alt={message.info?.alt!}
                      onImageSelected={ (maskImageUrl) => setOriginalImageMask({
                        original: message.info?.imageUrl!,
                        mask: maskImageUrl
                      })}
                    />
                  )
                  : (
                    <MyMessage key={index} text={message.text} />
                  )
              )
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
          onSendMessage={handlePost}
          placeHolder="Escribe aquí lo que deseas"
          disableCorrections
        />

      </div>
    </>
  )
}
