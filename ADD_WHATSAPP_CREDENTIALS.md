# 🔧 Add WhatsApp Credentials to Render

## Your WhatsApp Credentials:
- **Access Token**: `EAAL2J1MsZBMoBQkllUzdstZAMkwpPw62NKPf3aoDzryS6xhgXCgH2W1bPQNSq7Xym6zE9GbUcCvCJkIHHuDtiGVhsZC6LRJV51d6V7efsPDSMGw8hmClkLz0KZBg2s3tHEfernJDUZCurOujdhkKZBPgzJtCg7Y8PdSGJGRxpQ9A6rHzEZBMFINWaEFKZC7vDZBwBjtG7piu6XamzXBCtyQmyjmgPzjD35PKbuHaoAWEqZAcTYk6HGHXTF4oG1OozFjceKhwlZBOePfy29fc7h1JuaZCjGcj`
- **Phone Number ID**: `992612663930736`

## ⚡ EXACT STEPS TO ADD TO RENDER:

### Step 1: Go to Environment Variables
1. **In your Render dashboard** (where you currently are)
2. **Click the "Environment" tab** (next to Logs, Events, Settings)

### Step 2: Add These Environment Variables
Click "Add Environment Variable" for each of these:

#### Variable 1:
- **Key**: `WA_ACCESS_TOKEN`
- **Value**: `EAAL2J1MsZBMoBQkllUzdstZAMkwpPw62NKPf3aoDzryS6xhgXCgH2W1bPQNSq7Xym6zE9GbUcCvCJkIHHuDtiGVhsZC6LRJV51d6V7efsPDSMGw8hmClkLz0KZBg2s3tHEfernJDUZCurOujdhkKZBPgzJtCg7Y8PdSGJGRxpQ9A6rHzEZBMFINWaEFKZC7vDZBwBjtG7piu6XamzXBCtyQmyjmgPzjD35PKbuHaoAWEqZAcTYk6HGHXTF4oG1OozFjceKhwlZBOePfy29fc7h1JuaZCjGcj`

#### Variable 2:
- **Key**: `WA_PHONE_NUMBER_ID`
- **Value**: `992612663930736`

#### Variable 3:
- **Key**: `VERIFY_TOKEN`
- **Value**: `school_comm_verify_token_2026`

#### Variable 4:
- **Key**: `WA_WEBHOOK_URL`
- **Value**: `https://school-comm-system.onrender.com/webhook`

#### Variable 5:
- **Key**: `NODE_ENV`
- **Value**: `production`

#### Variable 6 (Optional but recommended):
- **Key**: `JWT_SECRET`
- **Value**: `school_comm_jwt_secret_super_secure_2026`

### Step 3: Save and Deploy
1. **Click "Save Changes"** after adding all variables
2. **Go back to the main service page**
3. **Click "Manual Deploy"**
4. **Select "Deploy latest commit"**
5. **Wait 3-5 minutes for deployment**

## ✅ Test Your Fixed App

After deployment completes, test these URLs:

### 1. Health Check:
```
https://school-comm-system.onrender.com/health
```
Should return: `{"status":"healthy",...}`

### 2. Webhook Verification:
```
https://school-comm-system.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=school_comm_verify_token_2026&hub.challenge=test123
```
Should return: `test123`

## 🎯 Expected Results

After adding credentials and redeploying:

1. **Logs will show**:
   ```
   ✅ Server started successfully
   ✅ WhatsApp API configured
   ✅ Webhook ready for connections
   ```

2. **No more authentication errors**

3. **Ready for WhatsApp integration**

## 📋 Next Steps After Success

1. ✅ Add environment variables (above)
2. ✅ Redeploy service
3. ✅ Test health endpoint
4. ✅ Test webhook verification
5. ✅ Configure WhatsApp webhook in Facebook Developer Console:
   - **Webhook URL**: `https://school-comm-system.onrender.com/webhook`
   - **Verify Token**: `school_comm_verify_token_2026`
6. ✅ Test sending messages from WhatsApp Business API

## 🚨 Important Notes

- **Access Token**: This is a temporary token that expires in 24 hours
- **For Production**: You'll need to get a permanent access token
- **Security**: Keep these credentials secure and never share them publicly

## 🎉 Success!

Once you add these credentials, your WhatsApp School Communication System will be:
- ✅ **Fully deployed** on Render
- ✅ **WhatsApp API connected** and authenticated
- ✅ **Ready to receive** teacher messages
- ✅ **Ready to send** parent notifications
- ✅ **Production-grade** and scalable

Your system will be live and ready for Nepal schools! 🚀