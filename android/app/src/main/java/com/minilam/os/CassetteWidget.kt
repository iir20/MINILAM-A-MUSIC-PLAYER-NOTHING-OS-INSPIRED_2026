package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.Alignment
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.glance.background

class CassetteWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(Color.Black)
                    .padding(12.dp)
            ) {
                // Outer Shell
                Box(
                    modifier = GlanceModifier
                        .fillMaxWidth()
                        .height(100.dp)
                        .background(Color.DarkGray.copy(alpha = 0.5f))
                        .padding(8.dp)
                ) {
                    Column(modifier = GlanceModifier.fillMaxSize()) {
                        // Reels Area
                        Row(
                            modifier = GlanceModifier
                                .fillMaxWidth()
                                .height(40.dp)
                                .background(Color.Black)
                                .padding(horizontal = 16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Reel()
                            Spacer(modifier = GlanceModifier.defaultWeight())
                            Reel()
                        }

                        Spacer(modifier = GlanceModifier.height(8.dp))

                        // Label
                        Box(
                            modifier = GlanceModifier
                                .fillMaxWidth()
                                .height(20.dp)
                                .background(Color(0xFFFF3B30))
                                .padding(4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "MINILAM_TAPE_TYPE_II",
                                style = TextStyle(color = ColorProvider(Color.Black), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }

                Spacer(modifier = GlanceModifier.height(8.dp))
                
                Text(
                    text = "POSITION: 04:20 / 90:00",
                    style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.6f)), fontSize = 8.sp)
                )
            }
        }
    }

    @Composable
    private fun Reel() {
        Box(
            modifier = GlanceModifier
                .size(24.dp)
                .background(Color.White.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = GlanceModifier
                    .size(6.dp)
                    .background(Color.White)
            ) {}
        }
    }
}
