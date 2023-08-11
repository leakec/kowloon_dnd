// extracted and refactored from skaplun 3D "Megapolis" https://shadertoy.com/view/MlKBWD

#define TIME_MULT   .5
#define IDLE_TIME   0.0
#define ON_TIME     0.7
#define NUM_COLS    7.0
#define WINDOW_SIZE 0.2

// rnd(p) fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453123)
#define rnd(p) fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453123)

void mainImage( out vec4 O, vec2 U ){
    vec2 R  = iResolution.xy;
    float p = NUM_COLS/R.y;
    U *= p;
	O-=O; 
    
    float t = fract(iTime * TIME_MULT);
    float mt = ceil(iTime * TIME_MULT);
    float cellStartTime = rnd(ceil(U) * mt) * .5 + IDLE_TIME;

    if ((t > cellStartTime) && (t < cellStartTime + ON_TIME))
    {
        U = smoothstep(p,0.,abs(fract(U)-.5) - WINDOW_SIZE/2. );
        O += U.x*U.y;
    }
 }
