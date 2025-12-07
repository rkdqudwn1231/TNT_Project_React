import React, { useEffect, useRef, useState } from 'react';
import styles from './Chatbot.module.css';
import { caxios } from '../../config/config';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { GiClothes } from "react-icons/gi";
import { MdOutlineCleaningServices } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";

const MessageList = React.memo(({ messages, chatLoading }) => (
    <>
        {messages.map((msg, i) => (
            <div key={i} className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                </ReactMarkdown>
            </div>
        ))}
        {chatLoading && (
            <div className={`${styles.botMessage} ${styles.loadingDots}`}>
                질문을 분석 중입니다
            </div>
        )}
    </>
));

const Chatbot = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isHome, setIsHome] = useState(false);
    const [messages, setMessages] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false); //창 껐다 키기용

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); //반응형 용도

    const [chatLoading, setChatLoading] = useState(false);

    //제거 모달용 상태변수
    const [delModalShow, setDelModalShow] = useState(false);
    const location = useLocation();
    const handleClose = () => setDelModalShow(false);
    const handleShow = () => setDelModalShow(true);

    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null); //메세지 최하단으로 위치하게 하기 용도.

    useEffect(() => {
        const handler = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handler); // 창 크기 바뀔때마다 적용

        const saved = sessionStorage.getItem("chatHistory");

        if (saved?.length > 1) {
            setMessages(JSON.parse(saved));
        }
        else {
            setMessages([{
                text: "당신의 퍼스널 컬러와 체형에 맞는 스타일을 추천해드립니다. 궁금한 점을 말해보세요.",
                sender: "bot"
            }])
        }

        return () => window.removeEventListener("resize", handler); // 이벤트 정리 ( 중복 방지 )
    }, []);

    useEffect(() => {
        const tokenVerify = async () => {
            try {
                await caxios.get("/chatbot");
                setIsLogin(true);
            } catch {
                setIsLogin(false);
                sessionStorage.removeItem("token");
            }
        };

        tokenVerify();

        setIsHome(location.pathname === "/");
    }, [location.pathname]); // ✅ URL 바뀔 때마다 재실행

    const handleSendMessage = async (message) => {
        if (message == "") {
            return false;
        }

        setInputValue("");
        if (textareaRef.current) textareaRef.current.style.height = "40px"; // 초기 높이로 리셋
        setChatLoading(true);

        // 1) 먼저 user 메시지를 만든다
        const newUserMsg = { text: message, sender: 'user' };
        const newHistory = [...messages, newUserMsg];

        // 2) 대화 목록에 반영
        setMessages((prev) => {
            const updated = [...prev, newUserMsg];
            sessionStorage.setItem("chatHistory", JSON.stringify(updated)); // ★ 즉시 저장
            return updated;
        });


        try {
            const res = await caxios.post("/chatbot/ask", {
                prompt: message,
                history: newHistory
            });
            // 💡 수정된 부분: res.data (객체)에서 .answer 키의 값 (문자열)을 추출
            const botMsg = { text: res.data.answer, sender: 'bot' };
            setMessages((prev) => {
                const updated = [...prev, botMsg];
                sessionStorage.setItem("chatHistory", JSON.stringify(updated));
                return updated;
            });

        } catch (err) {
            console.error(err, "caxios 에러");

            setMessages((prev) => {
                const updated = [...prev, { text: "오류 발생", sender: 'bot' }];
                sessionStorage.setItem("chatHistory", JSON.stringify(updated));
                return updated;
            });
        }

        setChatLoading(false);
    };


    //메세지 스크롤 최하단으로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleCleanMsg = async () => {

        if (chatLoading)
            return;

        try {
            // const token = sessionStorage.getItem('token');
            // const res = await caxios.delete("/chatbot", {
            //     data: { userId: token }
            // });

            setInputValue("");
            if (textareaRef.current) textareaRef.current.style.height = "40px"; // 초기 높이로 리셋
            setMessages(() => {
                const updated = [{
                    text: "당신의 퍼스널 컬러와 체형에 맞는 스타일을 추천해드립니다. 궁금한 점을 말해보세요.",
                    sender: "bot"
                }]
                sessionStorage.setItem("chatHistory", JSON.stringify(updated));
                return updated;
            });
        } catch (err) {
            console.error("삭제 실패:", err);
        }
        textareaRef.current?.focus();
        setDelModalShow(false);
    };

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current?.focus();
            setInputValue("");
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen]);

    return (
        isLogin && !isHome &&
        <div className={isMobile ? styles.mobileWrapper : styles.pcWrapper}>

            {/* 챗봇 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.chatbotBtn}
            >
                {isOpen ? <FaXmark /> : <IoChatbubbleEllipsesOutline />}
            </button>

            {/* 챗봇 창 */}
            {
                isOpen && (
                    <div className={`${styles.chatbotContainer} ${styles.fadeInUp}`}>
                        {/* 기존 Modal 대신 내부 모달로 구현 */}
                        {delModalShow && (
                            <div className={styles.localModalOverlay}>
                                <div className={styles.localModalContent}>
                                    <h5>알림</h5>
                                    <p>대화 내용을 제거하시겠습니까?</p>
                                    <div className={styles.localModalBtns}>
                                        <button onClick={handleCleanMsg}>예</button>
                                        <button onClick={handleClose}>아니오</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={styles.contentArea}>
                            <div className={styles.chatContainer}>
                                <div className={styles.contentHeader}>
                                    <div className={styles.contentTitle}>
                                        <GiClothes /> TNT 챗봇
                                    </div>
                                    <button className={styles.contentTitleBtn}
                                        onClick={handleShow}>
                                        <MdOutlineCleaningServices />
                                    </button>

                                </div>
                                <div className={styles.chatWindow}>
                                    <MessageList messages={messages} chatLoading={chatLoading} />
                                    <div ref={messagesEndRef} style={{ display: "inline-block" }} />
                                </div>

                                <div className={styles.inputArea}>
                                    <textarea
                                        ref={textareaRef}
                                        placeholder="스타일을 AI에게 질문해보세요"
                                        value={inputValue}
                                        rows={1}
                                        onChange={(e) => {
                                            const ta = e.target;
                                            ta.style.height = "auto";
                                            ta.style.height = ta.scrollHeight + "px";
                                            setInputValue(ta.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(inputValue);
                                            }
                                        }}
                                        readOnly={chatLoading}
                                    />

                                    <button
                                        className={styles.enterBtn}
                                        onClick={() => {
                                            handleSendMessage(inputValue);
                                        }}
                                    >
                                        <RiSendPlaneFill />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >

    );
};

export default Chatbot;