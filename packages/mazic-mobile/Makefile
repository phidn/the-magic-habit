# ===== PRE CLI ======== #

LTS_NODE_VER=20
NODE_VER=$(shell node -v)
ifeq ($(patsubst v$(LTS_NODE_VER).%,matched,$(NODE_VER)), matched)
	NODE_LTS=true
else
	NODE_LTS=false
endif

check-node-version:
	@$(NODE_LTS) || echo Build requires nodejs v$(LTS_NODE_VER)
	@$(NODE_LTS) && echo Check nodejs passed v$(LTS_NODE_VER)

switch-node-version:
	@current_ver=$$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1); \
	if [ "$$current_ver" -eq "$(LTS_NODE_VER)" ]; then \
		echo "Check nodejs passed v$(LTS_NODE_VER)"; \
	else \
		echo "Build requires nodejs v$(LTS_NODE_VER)"; \
		echo "Switching to nodejs v$(LTS_NODE_VER)..."; \
		nvm use $(LTS_NODE_VER); \
		echo "Switched to nodejs v$(LTS_NODE_VER)"; \
	fi

#### Environment ####
kill:
	- taskkill /f /im node.exe
	- taskkill /f /im java.exe
	- taskkill /f /im adb.exe
	- taskkill /f /im clang++.exe
	- taskkill /f /im ninja.exe
	- taskkill /f /im watchman.exe
	- cd ./android && ./gradlew --stop

clear-babel:
	- rm -rf node_modules/.cache/babel-loader/*

clear-build: clear-babel
	- rm -rf ./android/app/build
	- rm -rf ./android/app/.cxx
	- rm -rf ./android/build
	- rm -rf ./android/.gradle
	- rm -rf ./android/output

clear: clear-build
	- cd ./android && ./gradlew clean

clean: clear

emu:
	cd C:/Users/phidn/AppData/Local/Android/Sdk/emulator && ./emulator.exe -avd Pixel_7_API_35 -no-snapshot-save

emu-log:
	adb logcat -d | tail -n 100


#### Lint ####
type-check:
	yarn tsc

lint:
	yarn eslint .


#### Deps kit ####
deps-check:
	yarn rnx-align-deps

deps-fix:
	yarn rnx-align-deps --write

#### Generate ####
gen-bootsplash:
	yarn react-native generate-bootsplash ./src/assets/images/logo.png \
		--platforms=android,ios,web \
		--background=F5FCFF \
		--logo-width=100 \
		--assets-output=src/assets/bootsplash \
		--flavor=main \
		--html=public/index.html

rename-app:
	npx react-native-rename "Magic Habit - Daily Check-In" -b "com.magichabit"

#### Dev ####
envs:
	export APP_ENV=production

start: switch-node-version adb-reverse clear-babel
	APP_ENV=production yarn react-native start

start-rc: switch-node-version adb-reverse clear-babel
	APP_ENV=production yarn react-native start --reset-cache

adb-reverse:
	adb reverse tcp:8081 tcp:8081 && \
	adb reverse tcp:9090 tcp:9090

adb-rv: adb-reverse

#### Release ####

android-export:
	@echo "Exporting android..."
	- mv .local/index.android.bundle.zip .local/index.android.bundle.zip.bak.$$(( $$(ls -1 .local | wc -l) - 2 ))
	- mkdir -p android/output
	- yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/output/index.android.bundle --assets-dest android/output
	- cd android/output && yarn bestzip index.android.bundle.zip ./* && mv index.android.bundle.zip ../../.local/
	- cd ../../
	- rm -rf android/output
	@echo "Android exported."

release:
	make clean && make bundle && make release-build && make release-install
release-build:
	cd android && ./gradlew assembleProdRelease
release-install:
	adb install android/app/build/outputs/apk/prod/release/app-prod-release.apk

prod:
	make prod-code && make clean && make bundle && make prod-build && make prod-folder
prod-code:
	yarn react-native-version --never-amend
prod-build:
	cd android && ./gradlew bundleRelease
prod-folder:
	cd android/app/build/outputs/bundle/prodRelease && start .
bundle:
	npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

debug:
	yarn clean && yarn bundle && yarn debug-build && yarn debug-install
debug-build:
	cd android && gradlew assembleDebug
debug-install:
	adb install android/app/build/outputs/apk/debug/app-debug.apk
