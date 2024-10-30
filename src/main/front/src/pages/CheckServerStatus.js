import React, { useState, useEffect } from 'react';
import { checkServerStatus } from '../services/mainService';

function CheckServerStatus() {
    const [status, setStatus] = useState('');

    useEffect(() => {
        checkServerStatus()
            .then(response => setStatus(response.data))
            .catch(() => setStatus('서버 연결에 실패했습니다.'));
    }, []);

    return (
        <div>
            <h1>Server Status</h1>
            <p>{status}</p>
        </div>
    );
}

export default CheckServerStatus;
