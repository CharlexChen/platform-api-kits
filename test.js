import { xunFeiService } from 'platform-api-kits'

xunFeiService.sendChatData({
    messages: [{
        role: 'user',
        content: '123',
    }]
});