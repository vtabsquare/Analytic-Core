# Security Setup Guide

## 🔒 Before Pushing to GitHub

Your repository contains sensitive credentials that **must NOT** be committed to GitHub. Follow these steps:

### 1. Clean Git History (Remove Secrets)

If you've already committed files with secrets, you need to remove them from git history:

```bash
# Remove .env file from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Remove any SQL files that might contain credentials
git filter-breach --force --index-filter \
  "git rm --cached --ignore-unmatch *.sql" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to update remote repository
git push origin --force --all
```

**Alternative (Recommended): Use BFG Repo-Cleaner**

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove files with secrets
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --delete-files "*.sql"

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

### 2. Verify .gitignore

Make sure these files are in `.gitignore`:

```
.env
.env.local
*.env
*.sql
server.log
```

### 3. Set Up Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env** with your actual credentials:
   ```bash
   nano .env  # or use any text editor
   ```

3. **NEVER commit .env**:
   ```bash
   # Verify it's ignored
   git status  # .env should NOT appear
   ```

### 4. Safe Push Checklist

Before pushing to GitHub, verify:

- [ ] `.env` file is in `.gitignore`
- [ ] No hardcoded secrets in code files
- [ ] `.env.example` has placeholder values only
- [ ] SQL files are in `.gitignore`
- [ ] Removed secrets from git history
- [ ] Verified with: `git log --all --full-history -- .env`

### 5. Push to GitHub

```bash
# Add files
git add .

# Commit
git commit -m "feat: add Dataverse integration with secure credential management"

# Push
git push origin main
```

## 🚨 If GitHub Still Blocks Your Push

GitHub scans for secrets in:
1. Current changes
2. Entire commit history
3. All branches

### Solution: Create a New Repository

If the history is too polluted with secrets:

```bash
# 1. Remove .git folder
rm -rf .git

# 2. Initialize new repository
git init

# 3. Add all files (secrets are now in .gitignore)
git add .

# 4. Make first commit
git commit -m "Initial commit with secure credential management"

# 5. Add remote
git remote add origin https://github.com/yourusername/your-repo.git

# 6. Push
git push -u origin main
```

## 📝 Files That Are Safe to Commit

✅ **Safe**:
- `.env.example` (placeholder values)
- `.gitignore`
- Source code files (`*.js`, `*.tsx`, etc.)
- `package.json`
- Documentation without secrets

❌ **NEVER Commit**:
- `.env` (actual credentials)
- `*.sql` (may contain data/schema)
- `server.log` (may contain tokens)
- `*.backup` files
- Any file with actual credentials

## 🔐 Production Security

For production deployments:

1. **Use GitHub Secrets** (for GitHub Actions):
   - Repository Settings → Secrets and variables → Actions
   - Add each environment variable

2. **Use Azure Key Vault**:
   - Store secrets in Azure Key Vault
   - Reference them in your app

3. **Use Environment Variables** (for hosting platforms):
   - Vercel: Project Settings → Environment Variables
   - Heroku: Settings → Config Vars
   - Azure: Configuration → Application Settings

## 🆘 Emergency: Exposed Secrets

If you accidentally pushed secrets to GitHub:

1. **Immediately rotate all secrets**:
   - Generate new client secret in Azure
   - Update .env file locally
   - Never use the exposed secrets again

2. **Remove from GitHub**:
   - Follow "Clean Git History" steps above
   - Or create new repository

3. **Verify rotation**:
   - Test that old secrets no longer work
   - Test that new secrets work correctly

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Git filter-branch](https://git-scm.com/docs/git-filter-branch)

---

**Remember**: Once a secret is committed to git, consider it compromised. Always rotate exposed credentials immediately!
