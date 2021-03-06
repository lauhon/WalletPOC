#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Rust, NSObject)

RCT_EXTERN_METHOD(helloWorld:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(testWorld:(RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

@end
