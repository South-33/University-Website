// Animation Consistency Audit Script
// This script checks all HTML files for animation consistency issues

const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = '.';
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build'];

// Animation patterns to check
const ANIMATION_ISSUES = {
    conflictingFadeIn: /\.fade-in-section\s*{[^}]*opacity:\s*0[^}]*}/gi,
    duplicateTransitions: /transition:\s*[^;]+;/gi,
    conflictingTransforms: /transform:\s*translate[XY]/gi,
    pageSpecificAnimations: /\.fade-in-section\s*{/gi
};

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !EXCLUDED_DIRS.includes(file)) {
            scanDirectory(fullPath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(fullPath);
        }
    });
    
    return fileList;
}

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for conflicting fade-in-section styles
    if (ANIMATION_ISSUES.conflictingFadeIn.test(content)) {
        issues.push('Conflicting fade-in-section CSS found');
    }
    
    // Check for duplicate transition properties
    const transitions = content.match(ANIMATION_ISSUES.duplicateTransitions);
    if (transitions && transitions.length > 5) {
        issues.push('Excessive transition properties may cause conflicts');
    }
    
    // Check for page-specific animation overrides
    if (ANIMATION_ISSUES.pageSpecificAnimations.test(content)) {
        issues.push('Page-specific animation overrides global styles');
    }
    
    return {
        file: filePath,
        issues: issues,
        hasGlobalStyles: content.includes('../css/main.css'),
        hasGlobalJS: content.includes('../js/main.js')
    };
}

function runAudit() {
    console.log('🔍 Starting Animation Consistency Audit...\n');
    
    const htmlFiles = scanDirectory(ROOT_DIR);
    const results = [];
    
    htmlFiles.forEach(file => {
        try {
            const audit = auditFile(file);
            if (audit.issues.length > 0) {
                results.push(audit);
            }
        } catch (error) {
            console.error(`Error auditing ${file}:`, error.message);
        }
    });
    
    console.log(`📊 Audit Complete: ${results.length} files with issues\n`);
    
    if (results.length > 0) {
        console.log('⚠️  Files with animation issues:');
        results.forEach(result => {
            console.log(`\n📄 ${result.file}:`);
            result.issues.forEach(issue => {
                console.log(`   - ${issue}`);
            });
        });
    } else {
        console.log('✅ All files passed animation consistency check!');
    }
    
    return results;
}

// Run the audit
runAudit();
