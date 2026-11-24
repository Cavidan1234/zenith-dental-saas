"""
=============================================================================
DENTALBOOK.OS MASTER REGRESSION & ARCHITECTURAL AUDIT RUNNER
Executes all regression suites, concurrency, APIs, and file-length checks.
=============================================================================
"""

import sys
import os
import subprocess
import time
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ROOT = Path(__file__).resolve().parent.parent

def run_step(step_num, title, command, shell=True):
    print(f"\n[{step_num}/5] 🚀 {title}...")
    start = time.time()
    res = subprocess.run(
        command,
        cwd=PROJECT_ROOT,
        shell=shell,
        capture_output=True,
        text=True,
        encoding='utf-8',
        errors='replace'
    )
    duration = time.time() - start
    
    if res.returncode == 0:
        print(f"  ✅ PASSED ({duration:.2f}s)")
        return True
    else:
        print(f"  ❌ FAILED ({duration:.2f}s)")
        print("  --- STDOUT ---")
        print(res.stdout[-600:] if res.stdout else "None")
        print("  --- STDERR ---")
        print(res.stderr[-600:] if res.stderr else "None")
        return False

def check_file_lengths():
    print(f"\n[5/5] 📐 Checking 245-Line Architectural Discipline in src/...")
    src_dir = PROJECT_ROOT / "src"
    violations = []
    
    for p in src_dir.rglob("*"):
        if p.is_file() and p.suffix in [".tsx", ".ts"]:
            # Ignore raw CSS string file and font binaries
            if p.name in ["hero-sticker-css.ts", "GeistVF.woff", "GeistMonoVF.woff"]:
                continue
            with open(p, "r", encoding="utf-8", errors="ignore") as f:
                lines = len(f.readlines())
                if lines > 245:
                    violations.append((str(p.relative_to(PROJECT_ROOT)), lines))
                    
    if violations:
        print(f"  ❌ FOUND {len(violations)} VIOLATIONS (> 245 lines):")
        for v, l in violations:
            print(f"     - {v}: {l} lines")
        return False
    else:
        print("  ✅ 100% COMPLIANT: Every .tsx & .ts component strictly <= 245 lines!")
        return True

def main():
    print("=" * 70)
    print("🏥 DENTALBOOK.OS COMPREHENSIVE AUTOMATED VERIFICATION SUITE")
    print("=" * 70)
    
    overall_start = time.time()
    results = []
    
    # Step 1: TypeScript Compilation
    results.append(run_step(1, "TypeScript Static Compilation Check", "npx tsc --noEmit"))
    
    # Step 2: Jest Parallel Concurrency & Stripe Idempotency
    results.append(run_step(2, "Jest Concurrency & Availability Engine", "npm test"))
    
    # Step 3: Multi-Tenant REST API Persistence
    results.append(run_step(3, "Multi-Tenant REST API Suite", [sys.executable, "tests/test-tenants-api.py"], shell=False))
    
    # Step 4: Playwright 7-Suite Full E2E Funnel
    results.append(run_step(4, "Playwright 7-Suite Comprehensive E2E Funnel", [sys.executable, "tests/e2e-funnel.py"], shell=False))
    
    # Step 5: Architectural 245-line limit audit
    results.append(check_file_lengths())
    
    total_time = time.time() - overall_start
    print("\n" + "=" * 70)
    if all(results):
        print(f"🎉 ALL AUDITS PASSED WITH FLYING COLORS IN {total_time:.2f}s! 100% GREEN.")
    else:
        print(f"⚠️  SOME AUDITS REPORTED ISSUES (Total Time: {total_time:.2f}s).")
    print("=" * 70)
    
    sys.exit(0 if all(results) else 1)

if __name__ == "__main__":
    main()
