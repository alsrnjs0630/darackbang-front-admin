import React, { useState } from 'react';
import { Input, Button, Card, CardBody } from '@material-tailwind/react';

const LoginComponent = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password); // 부모 컴포넌트로부터 받은 로그인 함수 호출
    };

    return (
        <Card className="w-96">
            <CardBody>
                <h2 className="text-center text-2xl font-bold mb-6">다락방 로그인</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        label="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        label="패스워드"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" color="blue" fullWidth>
                        관리자 로그인
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};

export default LoginComponent;
