#!/bin/bash

# KcalCal - ADB 연결 유지 스크립트
# 이 스크립트는 ADB 포트 포워딩을 지속적으로 유지합니다.

echo "🔌 KcalCal ADB 연결 유지 시작..."
echo "Ctrl+C를 눌러 종료할 수 있습니다."
echo ""

while true; do
    # 기기 연결 확인
    DEVICE=$(adb devices | grep -w "device" | awk '{print $1}')
    
    if [ -z "$DEVICE" ]; then
        echo "⚠️  기기가 연결되지 않았습니다. 5초 후 재시도..."
        sleep 5
        continue
    fi
    
    echo "✅ 기기 연결됨: $DEVICE"
    
    # 포트 포워딩 설정
    adb reverse tcp:3000 tcp:3000 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ 포트 포워딩 활성화: localhost:3000"
    else
        echo "❌ 포트 포워딩 실패"
    fi
    
    # 10초마다 재확인
    sleep 10
done
