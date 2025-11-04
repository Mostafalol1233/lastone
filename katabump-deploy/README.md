# Bimora Backend Deployment for X-Host Server

This folder contains all the files needed to deploy your backend to your x-host server.

## 📦 Contents

- `index.js` - Main backend server file (compiled)
- `dist/public/` - Frontend static files
- `package.json` - Node.js dependencies list
- `package-lock.json` - Locked dependency versions
- `attached_assets/` - Images and static assets
- `.env.example` - Environment variables template

## 🚀 Deployment Steps for X-Host

### 1. Upload Files to X-Host Server

Upload this entire folder to your x-host server using FTP, SFTP, or your hosting provider's file manager.

### 2. Install Dependencies

SSH into your x-host server and run:

```bash
cd /path/to/your/app
npm install --production
```

This will install all required packages (approximately 425MB).

### 3. Configure Environment Variables

Copy the `.env.example` file to create your `.env` file:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual credentials:

```bash
# MongoDB Connection (Get this from your MongoDB Atlas dashboard)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority

# Environment
NODE_ENV=production

# Server Port (use x-host's assigned port or 5000)
PORT=5000

# JWT Secret (Generate a secure random string)
JWT_SECRET=generate-a-very-long-random-secure-string-here
```

**🔐 Security Checklist:**
- ✅ Replace `MONGODB_URI` with your actual MongoDB connection string
- ✅ Generate a strong random `JWT_SECRET` (minimum 32 characters)
- ✅ Never commit the `.env` file to version control
- ✅ Keep your credentials secure

### 4. Start the Server

#### Option A: Direct Start
```bash
node index.js
```

#### Option B: Quick Start Script
```bash
chmod +x start-server.sh
./start-server.sh
```

#### Option C: PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start index.js --name bimora-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

### 5. Verify Backend is Running

Visit: `http://your-x-host-domain.com:5000/api/news`

You should see a JSON array of news items.

## 🔧 Common PM2 Commands

```bash
pm2 status                  # Check app status
pm2 logs bimora-backend     # View logs in real-time
pm2 restart bimora-backend  # Restart app
pm2 stop bimora-backend     # Stop app
pm2 delete bimora-backend   # Remove app from PM2
pm2 monit                   # Monitor CPU/Memory usage
```

## 🌐 Next Steps

After your backend is running on x-host:

1. **Note your backend URL** (e.g., `https://api.yourdomain.com` or `https://yourdomain.com:5000`)
2. **Configure your frontend** to point to this backend URL
3. **Set up SSL certificate** (recommended for production)
4. **Configure domain DNS** if using a custom domain

## ⚠️ Important Notes

- **Port Configuration**: Make sure port 5000 (or your chosen port) is open in x-host firewall
- **MongoDB**: Ensure your MongoDB Atlas IP whitelist includes your x-host server IP
- **Database Seeding**: Your MongoDB should be seeded with initial data before deployment
- **Admin Access**: Create admin accounts through the admin interface after deployment
- **SSL/HTTPS**: For production, configure SSL certificate through x-host control panel

## 🆘 Troubleshooting

### Backend won't start

**Check MongoDB Connection:**
```bash
# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(e => console.error(e))"
```

**Verify Environment Variables:**
```bash
# List environment variables
cat .env
```

**Check Logs:**
```bash
pm2 logs bimora-backend
# or
tail -f ~/.pm2/logs/bimora-backend-error.log
```

### Can't connect to backend

**Check Firewall:**
- Verify port 5000 is open in x-host firewall settings
- Check if x-host requires specific port configuration

**Check Server Status:**
```bash
pm2 status
netstat -tuln | grep 5000
```

**Test Local Connection:**
```bash
curl http://localhost:5000/api/news
```

### MongoDB Connection Errors

**Common Issues:**
- **IP Whitelist**: Add your x-host server IP to MongoDB Atlas whitelist
- **Wrong Credentials**: Double-check username/password in connection string
- **Network Access**: Ensure MongoDB Atlas allows connections from your server
- **Connection String Format**: Verify the MongoDB URI format is correct

**Test MongoDB Connection:**
```bash
# Install MongoDB tools
npm install -g mongodb

# Test connection
mongosh "YOUR_MONGODB_URI"
```

### Frontend can't reach backend

**CORS Configuration:**
- Update backend CORS settings to allow frontend domain
- Check server logs for CORS errors

**URL Configuration:**
- Verify frontend is pointing to correct backend URL
- Ensure protocol (http/https) matches

### Performance Issues

**Check Resource Usage:**
```bash
pm2 monit
top
df -h
```

**Optimize for Production:**
```bash
# Increase Node.js memory limit if needed
pm2 delete bimora-backend
pm2 start index.js --name bimora-backend --max-memory-restart 500M
pm2 save
```

## 📊 Monitoring

### Set Up Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Monitor Application
```bash
# Real-time monitoring
pm2 monit

# Application info
pm2 info bimora-backend

# Memory usage
pm2 show bimora-backend
```

## 🔄 Updates and Maintenance

### Updating the Application

1. **Backup current version:**
```bash
cp -r /path/to/app /path/to/app.backup
```

2. **Upload new files** to x-host server

3. **Restart the application:**
```bash
pm2 restart bimora-backend
```

### Database Backups

Regularly backup your MongoDB database:
- Use MongoDB Atlas automatic backups
- Or export manually: `mongodump --uri="YOUR_MONGODB_URI"`

## 🆘 Support

For x-host specific issues:
- Check x-host documentation
- Contact x-host support team
- Review server error logs

For application issues:
- Check PM2 logs: `pm2 logs bimora-backend`
- Review MongoDB Atlas logs
- Verify environment variables are set correctly

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Platform:** Node.js + Express + MongoDB + React
