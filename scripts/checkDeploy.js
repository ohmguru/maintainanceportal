#!/usr/bin/env node

/**
 * Netlify Deployment Monitor
 * Checks the latest deployment status for the MechWarrior site
 */

const { execSync } = require('child_process');

const SITE_ID = '97341bc6-6f72-482b-973c-4653997aa2d0';
const SITE_NAME = 'mechwarrior';

console.log('🚀 MechWarrior Deployment Monitor\n');

try {
  // Get the latest deployment
  const deployments = JSON.parse(
    execSync(`netlify api listSiteDeploys --data='{"site_id": "${SITE_ID}"}'`, {
      encoding: 'utf8'
    })
  );

  if (!deployments || deployments.length === 0) {
    console.log('❌ No deployments found');
    process.exit(1);
  }

  const latest = deployments[0];

  // Parse the state
  const stateEmoji = {
    'ready': '✅',
    'building': '🔨',
    'error': '❌',
    'processing': '⚙️',
    'enqueued': '⏳'
  };

  console.log(`${stateEmoji[latest.state] || '❓'} Status: ${latest.state.toUpperCase()}`);
  console.log(`📦 Deploy ID: ${latest.id}`);
  console.log(`🌐 URL: ${latest.ssl_url}`);
  console.log(`🔗 Admin: ${latest.admin_url}`);
  console.log(`⏱️  Created: ${new Date(latest.created_at).toLocaleString()}`);
  console.log(`⏱️  Updated: ${new Date(latest.updated_at).toLocaleString()}`);

  if (latest.commit_ref) {
    console.log(`📝 Commit: ${latest.commit_ref.substring(0, 7)}`);
  }

  if (latest.deploy_time) {
    console.log(`⚡ Build Time: ${latest.deploy_time}s`);
  }

  if (latest.title) {
    console.log(`\n💬 Commit Message:\n${latest.title.split('\n')[0]}`);
  }

  if (latest.error_message) {
    console.log(`\n❌ Error: ${latest.error_message}`);
  }

  if (latest.state === 'ready') {
    console.log('\n🎉 Deployment is live and ready!');
    console.log(`   Visit: ${latest.ssl_url}`);
  } else if (latest.state === 'building') {
    console.log('\n⏳ Deployment is currently building...');
  }

  // Show previous deployments count
  const readyDeploys = deployments.filter(d => d.state === 'ready').length;
  console.log(`\n📊 Total ready deployments: ${readyDeploys}`);

} catch (error) {
  console.error('❌ Error checking deployment:', error.message);
  process.exit(1);
}
